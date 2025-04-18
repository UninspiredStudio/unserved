import type { Context, Next } from "hono";
import { readdir, stat } from "node:fs/promises";
import { file } from "bun";
import {
  getFilePath,
  getFilePathWithoutDefaultDocument,
} from "hono/utils/filepath";
import { join, relative } from "node:path";

const DEFAULT_DOCUMENT = "index.html";

export interface StaticMiddlewareOptions {
  root?: string;
  path?: string;
  precompressed?: boolean;
  directoryIndex?: boolean;
  rewriteRequestPath?: (path: string) => string;
  serveHiddenFiles?: boolean;
  spaMode?: boolean;
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

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function renderDirectoryIndex(
  root: string,
  path: string,
  serveHiddenFiles: boolean
) {
  const dirExists = await exists(path);
  if (!dirExists) {
    return null;
  }
  const dirEnts = await readdir(path, { withFileTypes: true });
  const files = dirEnts.filter((ent) => ent.isFile());
  const dirs = dirEnts.filter((ent) => ent.isDirectory());
  const hiddenDirectories = dirs.filter((ent) => ent.name.startsWith("."));
  const hiddenFiles = files.filter((ent) => ent.name.startsWith("."));
  const publicFiles = files.filter((ent) => !ent.name.startsWith("."));
  const publicDirs = dirs.filter((ent) => !ent.name.startsWith("."));
  const relPath = relative(root, path);
  const html = `
  <html>
  <body>
  <h1>Directory Index: ${relPath}</h1>
  <ul>
  ${publicFiles
    .map((file) => `<li><a href="./${file.name}">${file.name}</a></li>`)
    .join("\n")}
  ${publicDirs
    .map((dir) => `<li><a href="./${dir.name}/">${dir.name}/</a></li>`)
    .join("\n")}
  ${
    serveHiddenFiles
      ? hiddenDirectories
          .map((dir) => `<li><a href="./${dir.name}/">${dir.name}/</a></li>`)
          .join("\n")
      : ""
  }
  ${
    serveHiddenFiles
      ? hiddenFiles
          .map((file) => `<li><a href="./${file.name}">${file.name}</a></li>`)
          .join("\n")
      : ""
  }
  </ul>
  </body>
  </html>
  `;
  const htmlBytes = new TextEncoder().encode(html);

  return new Response(htmlBytes, {
    headers: {
      "Content-Type": "text/html",
      "Content-Length": htmlBytes.length.toString(),
      "Transfer-Encoding": "chunked",
    },
  });
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
    if (
      options.serveHiddenFiles !== true &&
      filename.split("/").some((part) => part.startsWith("."))
    ) {
      return next();
    }
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
          if (options.spaMode) {
            const parts = pathWithoutDefaultDocument.split("/");
            while (!content && parts.length > 0) {
              parts.pop();
              path = parts.join("/");
              const newPath = join("/", path, DEFAULT_DOCUMENT);
              content = await getFile(newPath);
            }
            if (!content) return next();
            c.res.headers.set("Content-Type", content.type);
            c.res.headers.set("Content-Length", content.size.toString());
            c.set("file", content);
            c.set("stream", content.stream());
            return next();
          }
          if (options.directoryIndex) {
            const res = await renderDirectoryIndex(
              root,
              pathWithoutDefaultDocument.slice(
                1,
                pathWithoutDefaultDocument.length
              ),
              options.serveHiddenFiles ?? false
            );
            if (!res) {
              return next();
            }
            return res;
          } else {
            return next();
          }
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
