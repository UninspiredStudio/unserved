import { parseArgs } from "node:util";
import type { UnservedConfigPartial } from "./config";

function getOptionsValues() {
  const { values } = parseArgs({
    options: {
      "server-port": {
        type: "string",
      },
      "server-hostname": {
        type: "string",
      },
      "server-log-disabled": {
        type: "boolean",
      },
      "server-autoport-disabled": {
        type: "boolean",
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
      "cache-disabled": {
        type: "boolean",
      },
      "etag-disabled": {
        type: "boolean",
      },
      "etag-max-age": {
        type: "string",
      },
      "compression-disabled": {
        type: "boolean",
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
  console.log({ options });

  return {
    server: {
      port:
        options["server-port"] === undefined
          ? undefined
          : parseInt(options["server-port"]),
      hostname: options["server-hostname"],
      log:
        options["server-log-disabled"] === undefined
          ? undefined
          : !options["server-log-disabled"],
      autoport:
        options["server-autoport-disabled"] === undefined
          ? undefined
          : !options["server-autoport-disabled"],
    },
    paths: {
      root: options["paths-root"],
      basePath: options["paths-base-path"],
      spaMode:
        options["paths-spa-mode"] === undefined
          ? undefined
          : !options["paths-spa-mode"],
      directoryIndex:
        options["paths-directory-index"] === undefined
          ? undefined
          : !options["paths-directory-index"],
    },
    cache: {
      enabled:
        options["cache-disabled"] === undefined
          ? undefined
          : !options["cache-disabled"],
    },
    etag: {
      enabled:
        options["etag-disabled"] === undefined
          ? undefined
          : !options["etag-disabled"],
      maxAge: options["etag-max-age"],
    },
    compression: {
      enabled:
        options["compression-disabled"] === undefined
          ? undefined
          : !options["compression-disabled"],
      gzip: {
        enabled:
          options["compression-gzip-enabled"] === undefined
            ? undefined
            : options["compression-gzip-enabled"],
        level: options["compression-gzip-level"],
        memLevel: options["compression-gzip-mem-level"],
        windowBits: options["compression-gzip-window-bits"],
      },
      brotli: {
        enabled:
          options["compression-brotli-enabled"] === undefined
            ? undefined
            : options["compression-brotli-enabled"],
        quality: options["compression-brotli-quality"],
      },
      deflate: {
        enabled:
          options["compression-deflate-enabled"] === undefined
            ? undefined
            : options["compression-deflate-enabled"],
        level: options["compression-deflate-level"],
        memLevel: options["compression-deflate-mem-level"],
        windowBits: options["compression-deflate-window-bits"],
      },
    },
  };
}
