import { type UnservedConfigPartial } from "./config";

export function getInt(val: string | undefined) {
  if (val === undefined) return undefined;
  const int = parseInt(val);
  if (!isNaN(int)) {
    return int;
  }
  return undefined;
}

export function getBool(val: string | undefined): boolean | undefined {
  if (val === undefined) return undefined;
  return val === "true";
}

export function getArray(val: string | undefined): string[] | undefined {
  if (val === undefined) return undefined;
  return val.split(",");
}

interface ActualEnv {
  NODE_ENV?: "production" | "development";
  SERVER_PORT?: number;
  SERVER_HOST?: string;
  SERVER_AUTOPORT_ENABLED?: boolean;
  SERVER_LOG_ENABLED?: boolean;
  SERVER_CONFIG_PATH?: string;
  SERVER_DEVELOPMENT?: boolean;
  SERVER_SERVE_HIDDEN_FILES?: boolean;
  PATHS_ROOT?: string;
  PATHS_SPA_MODE_ENABLED?: boolean;
  PATHS_BASE_PATH?: string;
  PATHS_DIRECTORY_INDEX_ENABLED?: boolean;
  CACHE_ENABLED?: boolean;
  ETAG_ENABLED?: boolean;
  ETAG_MAX_AGE?: number;
  COMPRESSION_ENABLED?: boolean;
  COMPRESSION_MIME_TYPES?: string[];
  COMPRESSION_GZIP_ENABLED?: boolean;
  COMPRESSION_GZIP_LEVEL?: number;
  COMPRESSION_GZIP_MEM_LEVEL?: number;
  COMPRESSION_GZIP_WINDOW_BITS?: number;
  COMPRESSION_BROTLI_ENABLED?: boolean;
  COMPRESSION_BROTLI_QUALITY?: number;
  COMPRESSION_DEFLATE_ENABLED?: boolean;
  COMPRESSION_DEFLATE_LEVEL?: number;
  COMPRESSION_DEFLATE_MEM_LEVEL?: number;
  COMPRESSION_DEFLATE_WINDOW_BITS?: number;
}

export const env: ActualEnv = {
  SERVER_DEVELOPMENT: getBool(import.meta.env.SERVER_DEVELOPMENT),
  SERVER_PORT: getInt(import.meta.env.SERVER_PORT),
  SERVER_HOST: import.meta.env.SERVER_HOST,
  SERVER_AUTOPORT_ENABLED: getBool(import.meta.env.SERVER_AUTOPORT_ENABLED),
  SERVER_LOG_ENABLED: getBool(import.meta.env.SERVER_LOG_ENABLED),
  SERVER_CONFIG_PATH: import.meta.env.SERVER_CONFIG_PATH,
  SERVER_SERVE_HIDDEN_FILES: getBool(import.meta.env.SERVER_SERVE_HIDDEN_FILES),
  PATHS_ROOT: import.meta.env.PATHS_ROOT,
  PATHS_SPA_MODE_ENABLED: getBool(import.meta.env.PATHS_SPA_MODE),
  PATHS_BASE_PATH: import.meta.env.PATHS_BASE_PATH,
  PATHS_DIRECTORY_INDEX_ENABLED: getBool(import.meta.env.PATHS_DIRECTORY_INDEX),
  CACHE_ENABLED: getBool(import.meta.env.CACHE_ENABLED),
  ETAG_ENABLED: getBool(import.meta.env.ETAG_ENABLED),
  ETAG_MAX_AGE: getInt(import.meta.env.ETAG_MAX_AGE),
  COMPRESSION_ENABLED: getBool(import.meta.env.COMPRESSION_ENABLED),
  COMPRESSION_MIME_TYPES: getArray(import.meta.env.COMPRESSION_MIME_TYPES),
  COMPRESSION_GZIP_ENABLED: getBool(import.meta.env.COMPRESSION_GZIP_ENABLED),
  COMPRESSION_GZIP_LEVEL: getInt(import.meta.env.COMPRESSION_GZIP_LEVEL),
  COMPRESSION_GZIP_MEM_LEVEL: getInt(
    import.meta.env.COMPRESSION_GZIP_MEM_LEVEL
  ),
  COMPRESSION_GZIP_WINDOW_BITS: getInt(
    import.meta.env.COMPRESSION_GZIP_WINDOW_BITS
  ),
  COMPRESSION_BROTLI_ENABLED: getBool(
    import.meta.env.COMPRESSION_BROTLI_ENABLED
  ),
  COMPRESSION_BROTLI_QUALITY: getInt(
    import.meta.env.COMPRESSION_BROTLI_QUALITY
  ),
  COMPRESSION_DEFLATE_ENABLED: getBool(
    import.meta.env.COMPRESSION_DEFLATE_ENABLED
  ),
  COMPRESSION_DEFLATE_LEVEL: getInt(import.meta.env.COMPRESSION_DEFLATE_LEVEL),
  COMPRESSION_DEFLATE_MEM_LEVEL: getInt(
    import.meta.env.COMPRESSION_DEFLATE_MEM_LEVEL
  ),
  COMPRESSION_DEFLATE_WINDOW_BITS: getInt(
    import.meta.env.COMPRESSION_DEFLATE_WINDOW_BITS
  ),
};

export function getEnvConfig(): UnservedConfigPartial {
  return {
    server: {
      development:
        env.SERVER_DEVELOPMENT ?? import.meta.env.NODE_ENV === "development",
      port: env.SERVER_PORT,
      hostname: env.SERVER_HOST,
      autoport: env.SERVER_AUTOPORT_ENABLED,
      log: env.SERVER_LOG_ENABLED,
      configPath: env.SERVER_CONFIG_PATH,
      serveHiddenFiles: env.SERVER_SERVE_HIDDEN_FILES,
    },
    paths: {
      root: env.PATHS_ROOT,
      spaMode: env.PATHS_SPA_MODE_ENABLED,
      basePath: env.PATHS_BASE_PATH,
      directoryIndex: env.PATHS_DIRECTORY_INDEX_ENABLED,
    },
    cache: {
      enabled: env.CACHE_ENABLED,
    },
    etag: {
      enabled: env.ETAG_ENABLED,
      maxAge: env.ETAG_MAX_AGE,
    },
    compression: {
      enabled: env.COMPRESSION_ENABLED,
      mimeTypes: env.COMPRESSION_MIME_TYPES,
      gzip: {
        enabled: env.COMPRESSION_GZIP_ENABLED,
        level: env.COMPRESSION_GZIP_LEVEL,
        memLevel: env.COMPRESSION_GZIP_MEM_LEVEL,
        windowBits: env.COMPRESSION_GZIP_WINDOW_BITS,
      },
      brotli: {
        enabled: env.COMPRESSION_BROTLI_ENABLED,
        quality: env.COMPRESSION_BROTLI_QUALITY,
      },
      deflate: {
        enabled: env.COMPRESSION_DEFLATE_ENABLED,
        level: env.COMPRESSION_DEFLATE_LEVEL,
        memLevel: env.COMPRESSION_DEFLATE_MEM_LEVEL,
        windowBits: env.COMPRESSION_DEFLATE_WINDOW_BITS,
      },
    },
  };
}
