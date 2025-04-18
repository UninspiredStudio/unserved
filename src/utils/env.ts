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
  SERVER_AUTOPORT_DISABLED?: boolean;
  SERVER_LOG_DISABLED?: boolean;
  PATHS_ROOT?: string;
  PATHS_SPA_MODE_DISABLED?: boolean;
  PATHS_BASE_PATH?: string;
  PATHS_DIRECTORY_INDEX_DISABLED?: boolean;
  CACHE_DISABLED?: boolean;
  ETAG_DISABLED?: boolean;
  ETAG_MAX_AGE?: number;
  COMPRESSION_DISABLED?: boolean;
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
  NODE_ENV:
    import.meta.env.NODE_ENV === "production" ? "production" : "development",
  SERVER_PORT: getInt(import.meta.env.SERVER_PORT),
  SERVER_HOST: import.meta.env.SERVER_HOST,
  SERVER_AUTOPORT_DISABLED: getBool(import.meta.env.SERVER_AUTOPORT_DISABLED),
  SERVER_LOG_DISABLED: getBool(import.meta.env.SERVER_LOG_DISABLED),
  PATHS_ROOT: import.meta.env.PATHS_ROOT,
  PATHS_SPA_MODE_DISABLED: getBool(import.meta.env.PATHS_SPA_MODE),
  PATHS_BASE_PATH: import.meta.env.PATHS_BASE_PATH,
  PATHS_DIRECTORY_INDEX_DISABLED: getBool(
    import.meta.env.PATHS_DIRECTORY_INDEX
  ),
  CACHE_DISABLED: getBool(import.meta.env.CACHE_DISABLED),
  ETAG_DISABLED: getBool(import.meta.env.ETAG_DISABLED),
  ETAG_MAX_AGE: getInt(import.meta.env.ETAG_MAX_AGE),
  COMPRESSION_DISABLED: getBool(import.meta.env.COMPRESSION_DISABLED),
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
      port: env.SERVER_PORT,
      hostname: env.SERVER_HOST,
      autoport:
        env.SERVER_AUTOPORT_DISABLED !== undefined
          ? !env.SERVER_AUTOPORT_DISABLED
          : undefined,
      log:
        env.SERVER_LOG_DISABLED !== undefined
          ? !env.SERVER_LOG_DISABLED
          : undefined,
    },
    paths: {
      root: env.PATHS_ROOT,
      spaMode:
        env.PATHS_SPA_MODE_DISABLED !== undefined
          ? !env.PATHS_SPA_MODE_DISABLED
          : undefined,
      basePath: env.PATHS_BASE_PATH,
      directoryIndex:
        env.PATHS_DIRECTORY_INDEX_DISABLED !== undefined
          ? !env.PATHS_DIRECTORY_INDEX_DISABLED
          : undefined,
    },
    cache: {
      enabled:
        env.CACHE_DISABLED !== undefined ? !env.CACHE_DISABLED : undefined,
    },
    etag: {
      enabled: env.ETAG_DISABLED !== undefined ? !env.ETAG_DISABLED : undefined,
      maxAge: env.ETAG_MAX_AGE,
    },
    compression: {
      enabled:
        env.COMPRESSION_DISABLED !== undefined
          ? !env.COMPRESSION_DISABLED
          : undefined,
      gzip: {
        enabled:
          env.COMPRESSION_GZIP_ENABLED !== undefined
            ? env.COMPRESSION_GZIP_ENABLED
            : undefined,
        level: env.COMPRESSION_GZIP_LEVEL,
        memLevel: env.COMPRESSION_GZIP_MEM_LEVEL,
        windowBits: env.COMPRESSION_GZIP_WINDOW_BITS,
      },
      brotli: {
        enabled:
          env.COMPRESSION_BROTLI_ENABLED !== undefined
            ? env.COMPRESSION_BROTLI_ENABLED
            : undefined,
        quality: env.COMPRESSION_BROTLI_QUALITY,
      },
      deflate: {
        enabled:
          env.COMPRESSION_DEFLATE_ENABLED !== undefined
            ? env.COMPRESSION_DEFLATE_ENABLED
            : undefined,
        level: env.COMPRESSION_DEFLATE_LEVEL,
        memLevel: env.COMPRESSION_DEFLATE_MEM_LEVEL,
        windowBits: env.COMPRESSION_DEFLATE_WINDOW_BITS,
      },
    },
  };
}
