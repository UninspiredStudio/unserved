import type { UnservedConfig } from "./config";

export const defaults: UnservedConfig = {
  server: {
    development: false,
    port: 3000,
    publicUrl: undefined,
    serveHiddenFiles: false,
    hostname: "localhost",
    secureHeaders: true,
    log: true,
    autoport: true,
    configPath: process.cwd(),
  },
  paths: {
    root: process.cwd(),
    basePath: "/",
    spaMode: false,
    directoryIndex: false,
  },
  cache: {
    enabled: true,
    mimeTypes: ["text/*", "script/*", "font/*", "image/icon", "image/svg+xml"],
  },
  etag: {
    enabled: true,
    maxAge: 60 * 60 * 24, // 1 day
  },
  compression: {
    enabled: true,
    mimeTypes: ["text/*", "script/*", "font/*", "image/icon", "image/svg+xml"],
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
  cors: {
    enabled: false,
    origin: [],
    allowHeaders: [],
    allowMethods: [],
    exposeHeaders: [],
    credentials: false,
    maxAge: 60 * 60 * 24, // 1 day
  },
  csrf: {
    enabled: false,
    origin: [],
  },
};
