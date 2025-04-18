import { serve, type BunFile } from "bun";
import { Hono } from "hono";
import { getConfig } from "./utils/config";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { compressionMiddleware } from "./middlewares/compression";
import { staticMiddleware } from "./middlewares/static";
import { renderMiddleware } from "./middlewares/render";
import { etagMiddleware } from "./middlewares/etag";
import { cacheMiddleware } from "./middlewares/cache";
import { getNextAvailablePort } from "./utils/ports";
import { startLog } from "./utils/startLog";
import { jsxRenderer } from "hono/jsx-renderer";

declare module "hono" {
  interface ContextVariableMap {
    file?: BunFile;
    stream?: ReadableStream<Uint8Array<ArrayBufferLike>>;
    lastModified?: number;
    bytes?: Uint8Array;
    headers?: Headers;
  }
}

async function main() {
  const { config, configFile } = await getConfig();

  const app = new Hono();

  if (config.server.log) {
    app.use(logger());
  }
  app.use(
    `${
      config.paths.basePath.endsWith("/")
        ? config.paths.basePath
        : `${config.paths.basePath}/`
    }*`,
    jsxRenderer(),
    secureHeaders(),
    (c, next) => {
      c.set("file", undefined);
      c.set("stream", undefined);
      c.set("lastModified", undefined);
      c.set("bytes", undefined);
      c.set("headers", undefined);
      return next();
    },
    staticMiddleware({
      root: config.paths.root,
      precompressed: config.compression.enabled,
      directoryIndex: config.paths.directoryIndex,
    }),
    etagMiddleware({
      enabled: config.etag.enabled,
      maxAge: config.etag.maxAge,
    }),
    cacheMiddleware({
      enabled: config.cache.enabled,
    }),
    compressionMiddleware({
      enabled: config.compression.enabled,
      gzip: config.compression.gzip,
      brotli: config.compression.brotli,
      deflate: config.compression.deflate,
    }),
    renderMiddleware()
  );

  const actualPort = config.server.autoport
    ? await getNextAvailablePort(config.server.port)
    : config.server.port;

  const server = serve({
    port: actualPort,
    hostname: config.server.hostname,
    reusePort: false,
    fetch: app.fetch,
  });

  startLog(server, config, configFile);
}

export default await main();
