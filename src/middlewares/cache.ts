import type { Context, Next } from "hono";
import type { UnservedConfig } from "../utils/config";
import { isOneOfMimeTypes } from "../utils/mimeType";

interface CacheEntry {
  lastModified: number;
  bytes: Uint8Array;
  headers: Record<string, string>;
}

const cache = new Map<string, CacheEntry>();

export type CacheMiddlewareOptions = UnservedConfig["cache"];

export const cacheMiddleware = (options: CacheMiddlewareOptions) => {
  return async (c: Context, next: Next) => {
    if (!options.enabled) return next();
    const path = c.req.path;
    const lastModified = c.get("lastModified");
    const mimeType = c.get("mimeType");
    if (!mimeType) return next();
    const isAllowed = isOneOfMimeTypes(mimeType, options.mimeTypes);
    if (!isAllowed) return next();

    let cacheResult = cache.get(path);
    if (!cacheResult || cacheResult.lastModified !== lastModified) {
      await next();
      const bytes = c.get("bytes");
      if (!bytes) return new Response("Not Found", { status: 404 });
      const headerMap = c.get("headerMap");
      const result = {
        lastModified: lastModified ?? Date.now(),
        bytes,
        headers: headerMap ?? {},
      };
      cache.set(path, result);
      c.res.headers.set("X-Cache", "MISS");
      return c.res;
    } else {
      c.res.headers.set("X-Cache", "HIT");
      const blob = new Blob([cacheResult.bytes], {
        type: mimeType,
      });
      return new Response(blob, {
        headers: cacheResult.headers,
      });
    }
  };
};
