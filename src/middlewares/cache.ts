import type { Context, Next } from "hono";
import type { UnservedConfig } from "../utils/config";

interface CacheEntry {
  lastModified: number;
  bytes: Uint8Array;
  headers: Headers;
}

const cache = new Map<string, CacheEntry>();

export type CacheMiddlewareOptions = UnservedConfig["cache"];

export const cacheMiddleware = (options: CacheMiddlewareOptions) => {
  return async (c: Context, next: Next) => {
    if (!options.enabled) return next();
    const file = c.get("file");
    if (!file) return next();
    const path = c.req.path;

    let cacheResult = cache.get(path);
    if (!cacheResult || cacheResult.lastModified !== file.lastModified) {
      await next();
      const bytes = c.get("bytes");
      const headers = c.get("headers");
      if (!bytes || !headers) return new Response("Not Found", { status: 404 });
      const result = {
        lastModified: file.lastModified,
        bytes,
        headers,
      };
      cache.set(path, result);
      cacheResult = result;
      c.res.headers.set("X-Cache", "MISS");
    } else {
      c.res.headers.set("X-Cache", "HIT");
    }

    const { bytes, headers } = cacheResult;
    return new Response(bytes, { headers });
  };
};
