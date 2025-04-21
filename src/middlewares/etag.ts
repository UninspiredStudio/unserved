import { CryptoHasher } from "bun";
import type { Context, Next } from "hono";
import type { Stream } from "../utils/stream";
import type { UnservedConfig } from "../utils/config";
import { objectToHeaders } from "../utils/headers";

export type EtagMiddlewareOptions = UnservedConfig["etag"];

interface EtagCacheEntry {
  lastModified: number;
  etag: string;
}

const etagCache = new Map<string, EtagCacheEntry>();

interface EtagResult {
  etag: string;
  stream: Stream;
}

async function generateEtag(stream: Stream): Promise<EtagResult> {
  const passthrough = new TransformStream<Uint8Array<ArrayBufferLike>>();
  const writer = passthrough.writable.getWriter();
  const hasher = new CryptoHasher("md5");
  // @ts-ignore
  for await (const chunk of stream) {
    hasher.update(chunk);
    writer.write(chunk);
  }
  writer.close();
  return {
    stream: passthrough.readable,
    etag: hasher.digest("hex"),
  };
}

export const etagMiddleware = (options: EtagMiddlewareOptions) => {
  return async (c: Context, next: Next) => {
    if (!options.enabled) return next();
    const file = c.get("file");
    if (!file) return next();
    const path = c.req.path;
    let etagResult = etagCache.get(path);
    if (!etagResult || etagResult.lastModified !== file.lastModified) {
      const inputStream = c.get("stream");
      if (!inputStream) return next();
      const lastModified = file.lastModified;
      const { stream: outputStream, etag } = await generateEtag(inputStream);
      etagResult = {
        lastModified,
        etag,
      };
      etagCache.set(path, etagResult);
      c.set("stream", outputStream);
      c.res.headers.set("X-Etag-Cache", "MISS");
    } else {
      c.res.headers.set("X-Etag-Cache", "HIT");
    }
    const { etag, lastModified } = etagResult;

    const lastModifiedIsoString = new Date(lastModified).toISOString();
    if (c.req.header("Pragma") !== "no-cache") {
      if (c.req.header("If-Modified-Since") === lastModifiedIsoString)
        return new Response(null, {
          status: 304,
        });
      if (c.req.header("If-None-Match") === etag)
        return new Response(null, { status: 304 });
    }

    c.set("headerMap", {
      ...c.get("headerMap"),
      Etag: etag,
      "Last-Modified": lastModifiedIsoString,
      "Cache-Control": `public,max-age=${options.maxAge}`,
    });

    return next();
  };
};
