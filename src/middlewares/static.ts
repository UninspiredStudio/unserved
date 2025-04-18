import type { Context, Next } from "hono";
import { stat } from "node:fs/promises";
import { file } from "bun";
import {
  getFilePath,
  getFilePathWithoutDefaultDocument,
} from "hono/utils/filepath";

const DEFAULT_DOCUMENT = "index.html";

export interface StaticMiddlewareOptions {
  root?: string;
  path?: string;
  precompressed?: boolean;
  directoryIndex?: boolean;
  rewriteRequestPath?: (path: string) => string;
}

async function resolvePath(path: string) {
  return path.startsWith("/") ? path : `./${path}`;
}

async function getFile(path?: string) {
  if (!path) return null;
  const bunFile = file(path);
  return (await bunFile.exists()) ? bunFile : null;
}

async function isDirectory(path: string) {
  let isDir: boolean = false;
  try {
    isDir = (await stat(path)).isDirectory();
  } catch {}
  return isDir;
}

export const staticMiddleware = (options: StaticMiddlewareOptions = {}) => {
  let isAbsoluteRoot = false;
  let root: string;

  if (options.root) {
    if (options.root.startsWith("/")) {
      isAbsoluteRoot = true;
      root = new URL(`file://${options.root}`).pathname;
    } else {
      root = options.root;
    }
  }

  return async (c: Context, next: Next) => {
    if (c.finalized) return next();

    let filename = options.path ?? decodeURI(c.req.path);
    filename = options.rewriteRequestPath
      ? options.rewriteRequestPath(filename)
      : filename;

    // If it was Directory, force `/` on the end.
    if (!filename.endsWith("/") && (await isDirectory(filename))) {
      const path = getFilePathWithoutDefaultDocument({
        filename,
        root: options.root,
      });
      if (path && (await isDirectory(path))) {
        filename += "/";
      }
    }

    let path = getFilePath({
      filename,
      root: options.root,
      defaultDocument: DEFAULT_DOCUMENT,
    });

    if (!path) {
      return next();
    }

    if (isAbsoluteRoot) {
      path = "/" + path;
    }
    path = await resolvePath(path);
    let content = await getFile(path);

    if (!content) {
      let pathWithoutDefaultDocument = getFilePathWithoutDefaultDocument({
        filename,
        root,
      });
      if (!pathWithoutDefaultDocument) {
        return next();
      }
      pathWithoutDefaultDocument = await resolvePath(
        pathWithoutDefaultDocument
      );

      if (pathWithoutDefaultDocument !== path) {
        content = await getFile(pathWithoutDefaultDocument);
        if (content) {
          path = pathWithoutDefaultDocument;
        } else {
          return c.text("TODO: Directory index", 500);
        }
      }
    }

    if (!content) {
      return next();
    }

    c.res.headers.set("Content-Type", content.type);
    c.res.headers.set("Content-Length", content.size.toString());
    c.set("file", content);
    c.set("stream", content.stream());
    return next();
  };
};
