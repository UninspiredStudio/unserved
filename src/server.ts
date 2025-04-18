import { serve, type BunFile } from "bun";
import { Hono } from "hono";
import { getConfig } from "./utils/config";
import { staticMiddleware } from "./middlewares/static";
import { renderMiddleware } from "./middlewares/render";
import { getNextAvailablePort } from "./utils/ports";
import { startLog } from "./utils/startLog";
import { resolve } from "node:path";
import { noopMiddleware } from "./middlewares/noop";
import { CONFIG_FILE_JSON, CONFIG_FILE_TOML } from "./utils/configFile";

declare module "hono" {
  interface ContextVariableMap {
    file?: BunFile;
    stream?: ReadableStream<Uint8Array<ArrayBufferLike>>;
    lastModified?: number;
    bytes?: Uint8Array;
    headers?: Headers;
  }
}

function resolveRoot(configPath: string, rootPath: string) {
  const configPathWithoutFile = configPath
    .replace(`/${CONFIG_FILE_JSON}`, "")
    .replace(`/${CONFIG_FILE_TOML}`, "");
  if (rootPath.startsWith("/")) {
    return rootPath;
  }
  const returnPath = resolve(configPathWithoutFile, rootPath);
  return returnPath;
}

async function main() {
  const { config, configFile } = await getConfig();

  const app = new Hono();

  const loggerMiddleware = config.server.log
    ? await import("hono/logger").then(({ logger }) => logger())
    : noopMiddleware();
  const secureHeadersMiddleware = config.server.secureHeaders
    ? await import("hono/secure-headers").then(({ secureHeaders }) =>
        secureHeaders()
      )
    : noopMiddleware();
  const csrfMiddleware = config.csrf.enabled
    ? await import("hono/csrf").then(({ csrf }) =>
        csrf({
          origin: config.csrf.origin,
        })
      )
    : noopMiddleware();
  const corsMiddleware = config.cors.enabled
    ? await import("hono/cors").then(({ cors }) =>
        cors({
          origin: config.cors.origin,
        })
      )
    : noopMiddleware();

  const etagMiddleware = config.etag.enabled
    ? await import("./middlewares/etag").then(({ etagMiddleware }) =>
        etagMiddleware({
          enabled: config.etag.enabled,
          maxAge: config.etag.maxAge,
        })
      )
    : noopMiddleware();

  const cacheMiddleware = config.cache.enabled
    ? await import("./middlewares/cache").then(({ cacheMiddleware }) =>
        cacheMiddleware({
          enabled: config.cache.enabled,
        })
      )
    : noopMiddleware();

  const compressionMiddleware = config.compression.enabled
    ? await import("./middlewares/compression").then(
        ({ compressionMiddleware }) =>
          compressionMiddleware({
            enabled: config.compression.enabled,
            mimeTypes: config.compression.mimeTypes,
            gzip: config.compression.gzip,
            brotli: config.compression.brotli,
            deflate: config.compression.deflate,
          })
      )
    : noopMiddleware();
  const rootPath = resolveRoot(config.server.configPath, config.paths.root);

  app.use(
    config.paths.basePath
      ? config.paths.basePath.endsWith("/")
        ? `${config.paths.basePath}*`
        : `${config.paths.basePath}/*`
      : "/*",
    (c, next) => {
      c.set("file", undefined);
      c.set("stream", undefined);
      c.set("lastModified", undefined);
      c.set("bytes", undefined);
      c.set("headers", undefined);
      return next();
    },
    await loggerMiddleware,
    staticMiddleware({
      root: rootPath,
      precompressed: config.compression.enabled,
      directoryIndex: config.paths.directoryIndex,
      serveHiddenFiles: config.server.serveHiddenFiles,
      spaMode: config.paths.spaMode,
    }),
    await etagMiddleware,
    await cacheMiddleware,
    await compressionMiddleware,
    await csrfMiddleware,
    await corsMiddleware,
    await secureHeadersMiddleware,
    renderMiddleware()
  );

  const actualPort = config.server.autoport
    ? await getNextAvailablePort(config.server.port)
    : config.server.port;

  const server = serve({
    development: config.server.development,
    port: actualPort,
    hostname: config.server.hostname,
    reusePort: false,
    fetch: app.fetch,
  });

  startLog(server, config, rootPath, configFile);
}

export default await main();
