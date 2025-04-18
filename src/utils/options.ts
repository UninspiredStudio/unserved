import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { UnservedConfigPartial } from "./config";

function getOptionsValues() {
  const argv = yargs(hideBin(Bun.argv))
    .option("server-development", {
      type: "boolean",
      description: "Enable development mode",
    })
    .option("server-port", {
      type: "string",
      description: "Server port number",
    })
    .option("server-hostname", {
      type: "string",
      description: "Server hostname",
    })
    .option("server-log-enabled", {
      type: "boolean",
      description: "Enable server logging",
    })
    .option("server-autoport-enabled", {
      type: "boolean",
      description: "Enable automatic port selection",
    })
    .option("server-serve-hidden-files", {
      type: "boolean",
      description: "Serve hidden files",
    })
    .option("server-config-path", {
      type: "string",
      description: "Path to configuration file",
    })
    .option("paths-root", {
      type: "string",
      description: "Root directory path",
    })
    .option("paths-base-path", {
      type: "string",
      description: "Base path for serving files",
    })
    .option("paths-spa-mode", {
      type: "boolean",
      description: "Enable SPA mode",
    })
    .option("paths-directory-index", {
      type: "boolean",
      description: "Enable directory index",
    })
    .option("cache-enabled", {
      type: "boolean",
      description: "Enable caching",
    })
    .option("etag-enabled", {
      type: "boolean",
      description: "Enable ETag",
    })
    .option("etag-max-age", {
      type: "string",
      description: "ETag max age",
    })
    .option("compression-enabled", {
      type: "boolean",
      description: "Enable compression",
    })
    .option("compression-mime-types", {
      type: "string",
      description: "Compression MIME types",
    })
    .option("compression-gzip-enabled", {
      type: "boolean",
      description: "Enable GZIP compression",
    })
    .option("compression-gzip-level", {
      type: "string",
      description: "GZIP compression level",
    })
    .option("compression-gzip-mem-level", {
      type: "string",
      description: "GZIP memory level",
    })
    .option("compression-gzip-window-bits", {
      type: "string",
      description: "GZIP window bits",
    })
    .option("compression-brotli-enabled", {
      type: "boolean",
      description: "Enable Brotli compression",
    })
    .option("compression-brotli-quality", {
      type: "string",
      description: "Brotli compression quality",
    })
    .option("compression-deflate-enabled", {
      type: "boolean",
      description: "Enable Deflate compression",
    })
    .option("compression-deflate-level", {
      type: "string",
      description: "Deflate compression level",
    })
    .option("compression-deflate-mem-level", {
      type: "string",
      description: "Deflate memory level",
    })
    .option("compression-deflate-window-bits", {
      type: "string",
      description: "Deflate window bits",
    })
    .parseSync();

  return argv;
}

export function getOptions(): UnservedConfigPartial {
  const options = getOptionsValues();

  return {
    server: {
      development: options["server-development"],
      port:
        options["server-port"] === undefined
          ? undefined
          : parseInt(options["server-port"]),
      hostname: options["server-hostname"],
      log: options["server-log-enabled"],
      serveHiddenFiles: options["server-serve-hidden-files"],
      autoport: options["server-autoport-enabled"],
      configPath: options["server-config-path"],
    },
    paths: {
      root: options["paths-root"],
      basePath: options["paths-base-path"],
      spaMode: options["paths-spa-mode"],
      directoryIndex: options["paths-directory-index"],
    },
    cache: {
      enabled: options["cache-enabled"],
    },
    etag: {
      enabled: options["etag-enabled"],
      maxAge: options["etag-max-age"],
    },
    compression: {
      enabled: options["compression-enabled"],
      mimeTypes: options["compression-mime-types"],
      gzip: {
        enabled: options["compression-gzip-enabled"],
        level: options["compression-gzip-level"],
        memLevel: options["compression-gzip-mem-level"],
        windowBits: options["compression-gzip-window-bits"],
      },
      brotli: {
        enabled: options["compression-brotli-enabled"],
        quality: options["compression-brotli-quality"],
      },
      deflate: {
        enabled: options["compression-deflate-enabled"],
        level: options["compression-deflate-level"],
        memLevel: options["compression-deflate-mem-level"],
        windowBits: options["compression-deflate-window-bits"],
      },
    },
  };
}
