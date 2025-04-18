import { parseArgs } from "node:util";
import type { UnservedConfigPartial } from "./config";

function getOptionsValues() {
  const { values } = parseArgs({
    options: {
      "server-development": {
        type: "boolean",
      },
      "server-port": {
        type: "string",
      },
      "server-hostname": {
        type: "string",
      },
      "server-log-enabled": {
        type: "boolean",
      },
      "server-autoport-enabled": {
        type: "boolean",
      },
      "server-serve-hidden-files": {
        type: "boolean",
      },
      "server-config-path": {
        type: "string",
      },
      "paths-root": {
        type: "string",
      },
      "paths-base-path": {
        type: "string",
      },
      "paths-spa-mode": {
        type: "boolean",
      },
      "paths-directory-index": {
        type: "boolean",
      },
      "cache-enabled": {
        type: "boolean",
      },
      "etag-enabled": {
        type: "boolean",
      },
      "etag-max-age": {
        type: "string",
      },
      "compression-enabled": {
        type: "boolean",
      },
      "compression-mime-types": {
        type: "string",
      },
      "compression-gzip-enabled": {
        type: "boolean",
      },
      "compression-gzip-level": {
        type: "string",
      },
      "compression-gzip-mem-level": {
        type: "string",
      },
      "compression-gzip-window-bits": {
        type: "string",
      },
      "compression-brotli-enabled": {
        type: "boolean",
      },
      "compression-brotli-quality": {
        type: "string",
      },
      "compression-deflate-enabled": {
        type: "boolean",
      },
      "compression-deflate-level": {
        type: "string",
      },
      "compression-deflate-mem-level": {
        type: "string",
      },
      "compression-deflate-window-bits": {
        type: "string",
      },
    },
    allowPositionals: true,
    allowNegativeNumbers: false,
  });
  return values;
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
