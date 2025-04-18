declare module "bun" {
  interface Env {
    SERVER_PORT?: string;
    SERVER_HOST?: string;
    SERVER_AUTOPORT_ENABLED?: string;
    SERVER_LOG_ENABLED?: string;
    SERVER_CONFIG_PATH?: string;
    SERVER_DEVELOPMENT?: string;
    PATHS_ROOT?: string;
    PATHS_SPA_MODE_ENABLED?: string;
    PATHS_BASE_PATH?: string;
    PATHS_DIRECTORY_INDEX_ENABLED?: string;
    CACHE_ENABLED?: string;
    ETAG_ENABLED?: string;
    ETAG_MAX_AGE?: string;
    COMPRESSION_ENABLED?: string;
    COMPRESSION_MIME_TYPES?: string;
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
