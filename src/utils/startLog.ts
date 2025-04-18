import type { Server } from "bun";
import type { UnservedConfig } from "./config";
import { resolve } from "node:path";

export function startLog(
  server: Server,
  options: UnservedConfig,
  configFile?: string
) {
  const enabledFeatures: string[] = [];
  const disabledFeatures: string[] = [];

  if (options.server.log) {
    enabledFeatures.push("Logging");
  } else {
    disabledFeatures.push("Logging");
  }

  if (options.cache.enabled) {
    enabledFeatures.push("Caching");
  } else {
    disabledFeatures.push("Caching");
  }

  if (options.etag.enabled) {
    enabledFeatures.push("ETag");
  } else {
    disabledFeatures.push("ETag");
  }

  const enabledCompression: string[] = [];
  const disabledCompression: string[] = [];

  if (options.compression.enabled) {
    enabledFeatures.push("Compression");
    if (options.compression.gzip.enabled) {
      enabledCompression.push("Gzip");
    } else {
      disabledCompression.push("Gzip");
    }
    if (options.compression.brotli.enabled) {
      enabledCompression.push("Brotli");
    } else {
      disabledCompression.push("Brotli");
    }
    if (options.compression.deflate.enabled) {
      enabledCompression.push("Deflate");
    } else {
      disabledCompression.push("Deflate");
    }
  } else {
    disabledFeatures.push("Compression");
  }

  const table: Record<string, string> = {
    URL: server.url.toString(),
    Root: resolve(options.paths.root),
    "Base Path": options.paths.basePath,
  };

  if (enabledFeatures.length > 0) {
    table["Enabled Features"] = enabledFeatures.join(", ");
  }
  if (disabledFeatures.length > 0) {
    table["Disabled Features"] = disabledFeatures.join(", ");
  }

  if (enabledCompression.length > 0) {
    table["Enabled Compression"] = enabledCompression.join(", ");
  }
  if (disabledCompression.length > 0) {
    table["Disabled Compression"] = disabledCompression.join(", ");
  }

  if (options.paths.spaMode) {
    table["SPA Mode"] = "Enabled";
  }
  if (options.paths.directoryIndex) {
    table["Directory Index"] = "Enabled";
  }

  if (configFile) {
    table["Config File"] = `./${configFile}`;
  }

  console.table(table);
}
