declare module "bun" {
  interface Env {
    NODE_ENV?: "production" | "development";
    SERVER_PORT?: string;
    SERVER_HOST?: string;
    SERVER_AUTOPORT_DISABLED?: string;
    SERVER_LOG_DISABLED?: string;
    PATHS_ROOT?: string;
    PATHS_SPA_MODE_DISABLED?: string;
    PATHS_BASE_PATH?: string;
    PATHS_DIRECTORY_INDEX_DISABLED?: string;
    CACHE_DISABLED?: string;
    ETAG_DISABLED?: string;
    ETAG_MAX_AGE?: string;
    COMPRESSION_DISABLED?: string;
    COMPRESSION_GZIP_ENABLED?: string;
    COMPRESSION_GZIP_LEVEL?: string;
    COMPRESSION_GZIP_MEM_LEVEL?: string;
    COMPRESSION_GZIP_WINDOW_BITS?: string;
    COMPRESSION_BROTLI_ENABLED?: string;
    COMPRESSION_BROTLI_QUALITY?: string;
    COMPRESSION_DEFLATE_ENABLED?: string;
    COMPRESSION_DEFLATE_LEVEL?: string;
    COMPRESSION_DEFLATE_MEM_LEVEL?: string;
    COMPRESSION_DEFLATE_WINDOW_BITS?: string;
  }
}
