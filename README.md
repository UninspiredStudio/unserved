# @uninspired/unserved

A simple, flexible, and powerful HTTP server based on Bun and Hono.

> You need Bun installed to use this package.

## Features

- Streaming HTTP responses from file read to response stream
- Static file serving with optional compression and caching
- In-memory cache for responses
- Automatic directory listing for missing files
- SPA mode for single-page applications
- Automatic port selection

## Roadmap

- [x] In-memory cache
- [x] Etag
- [x] Compression
- [x] Directory Listings
- [x] SPA Mode
- [ ] Automatic TLS

## Installation

Either install the package globally:

```bash
# Install globally
bun add -g @uninspired/unserved
# Run the server
unserved
```

Or run it directly:

```bash
# Run the server directly
bunx @uninspired/unserved
```

## Configuration

Unserved can be configured through a configuration file, CLI arguments, or environment variables.

Configuration is read in the following order:

1. Environment variables
2. Configuration file
3. CLI arguments

Each will override the previous one.

### CLI Arguments

You can pass the configuration file path as a CLI argument:

```bash
# Run the server with a specific configuration file
unserved --server-config-path ./config.toml
```

The following options are also supported:

```bash
unserved --help

Options:
  --help                             Show help                         [boolean]
  --version                          Show version number               [boolean]
  --server-development               Enable development mode           [boolean]
  --server-port                      Server port number                 [string]
  --server-hostname                  Server hostname                    [string]
  --server-log-enabled               Enable server logging             [boolean]
  --server-autoport-enabled          Enable automatic port selection   [boolean]
  --server-serve-hidden-files        Serve hidden files                [boolean]
  --server-config-path               Path to configuration file         [string]
  --paths-root                       Root directory path                [string]
  --paths-base-path                  Base path for serving files        [string]
  --paths-spa-mode                   Enable SPA mode                   [boolean]
  --paths-directory-index            Enable directory index            [boolean]
  --cache-enabled                    Enable caching                    [boolean]
  --etag-enabled                     Enable ETag                       [boolean]
  --etag-max-age                     ETag max age                       [string]
  --compression-enabled              Enable compression                [boolean]
  --compression-mime-types           Compression MIME types             [string]
  --compression-gzip-enabled         Enable GZIP compression           [boolean]
  --compression-gzip-level           GZIP compression level             [string]
  --compression-gzip-mem-level       GZIP memory level                  [string]
  --compression-gzip-window-bits     GZIP window bits                   [string]
  --compression-brotli-enabled       Enable Brotli compression         [boolean]
  --compression-brotli-quality       Brotli compression quality         [string]
  --compression-deflate-enabled      Enable Deflate compression        [boolean]
  --compression-deflate-level        Deflate compression level          [string]
  --compression-deflate-mem-level    Deflate memory level               [string]
  --compression-deflate-window-bits  Deflate window bits                [string]
```

### Configuration File

The configuration file is a either a `unserved.json` or `unserved.toml` file that is located in the current working directory. The path to the configuration file can also be specified through the `UNSERVED_CONFIG_PATH` environment variable or the `--server-config-path` CLI argument.

```toml unserved.toml
[server]
port = 3000
```

```json unserved.json
{
  "server": {
    "port": 3000
  }
}
```

The following options are supported:

```ts
interface UnservedConfig {
  server: {
    port: number;
    host: string;
    autoport: boolean;
    log: boolean;
    configPath: string;
    development: boolean;
    serveHiddenFiles: boolean;
  };
  paths: {
    root: string;
    basePath: string;
    spaMode: boolean;
    directoryIndex: boolean;
  };
  cache: {
    enabled: boolean;
  };
  etag: {
    enabled: boolean;
    maxAge: number;
  };
  compression: {
    enabled: boolean;
    mimeTypes: string[];
    gzip: {
      enabled: boolean;
      level: number;
      memLevel: number;
      windowBits: number;
    };
    deflate: {
      enabled: boolean;
      level: number;
      memLevel: number;
      windowBits: number;
    };
    brotli: {
      enabled: boolean;
      quality: number;
    };
  };
  cors: {
    enabled: boolean;
    maxAge: number;
    origin: string[];
    allowHeaders: string[];
    allowMethods: string[];
    exposeHeaders: string[];
    credentials: boolean;
  };
  csrf: {
    enabled: boolean;
    origin: string[];
  };
}
```

### Environment Variables

The following environment variables are supported:

```ts
interface Env {
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
```
