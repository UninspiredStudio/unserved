import type { UnservedConfig } from "./config";

export const defaults: UnservedConfig = {
  server: {
    port: 3000,
    hostname: "localhost",
    log: true,
    autoport: true,
  },
  paths: {
    root: process.cwd(),
    basePath: "/",
    spaMode: false,
    directoryIndex: false,
  },
  cache: {
    enabled: true,
  },
  etag: {
    enabled: true,
    maxAge: 60 * 60 * 24, // 1 day
  },
  compression: {
    enabled: true,
    gzip: {
      enabled: true,
      level: 9,
      memLevel: 8,
      windowBits: 15,
    },
    brotli: {
      enabled: true,
      quality: 11,
    },
    deflate: {
      enabled: true,
      level: 9,
      memLevel: 8,
      windowBits: 15,
    },
  },
};
