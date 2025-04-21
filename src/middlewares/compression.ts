import type { Context, Next } from "hono";
import { gzipSync, deflateSync, readableStreamToBytes, file } from "bun";
import { brotliCompressSync, constants } from "node:zlib";
import type { Stream, StreamData } from "../utils/stream";
import type { UnservedConfig } from "../utils/config";
import { isOneOfMimeTypes } from "../utils/mimeType";

export type CompressionMiddlewareOptions = UnservedConfig["compression"];

interface CompressResult {
  stream: Stream;
  size: number;
}

interface Encoding {
  key: string;
  priority?: number;
}

async function compressGzip(
  stream: Stream,
  options: UnservedConfig["compression"]["gzip"]
): Promise<CompressResult> {
  const passthrough = new TransformStream<StreamData>();
  const writer = passthrough.writable.getWriter();

  let compressedSize: number = 0;

  const bytes = await readableStreamToBytes(stream);
  let compressed = gzipSync(bytes, {
    level: options.level,
    memLevel: options.memLevel,
    windowBits: options.windowBits,
  });
  while (compressed.length > 0) {
    const slice = compressed.slice(0, 1024);
    writer.write(slice);
    compressed = compressed.slice(1024);
    compressedSize += slice.length;
  }
  writer.close();

  return {
    stream: passthrough.readable,
    size: compressedSize,
  };
}

async function compressBrotli(
  stream: Stream,
  mimeType: string,
  size: number,
  options: UnservedConfig["compression"]["brotli"]
): Promise<CompressResult> {
  const passthrough = new TransformStream<StreamData>();
  const writer = passthrough.writable.getWriter();
  let mode: number = constants.BROTLI_MODE_GENERIC;
  if (mimeType.startsWith("text/") || mimeType.startsWith("script/"))
    mode = constants.BROTLI_MODE_TEXT;
  else if (mimeType.endsWith("woff2")) mode = constants.BROTLI_MODE_FONT;
  else mode = constants.BROTLI_MODE_GENERIC;

  let compressedSize: number = 0;
  const bytes = await readableStreamToBytes(stream);
  let compressed = brotliCompressSync(bytes, {
    params: {
      [constants.BROTLI_PARAM_SIZE_HINT]: size,
      [constants.BROTLI_PARAM_MODE]: mode,
      [constants.BROTLI_PARAM_QUALITY]: options.quality,
    },
  });
  while (compressed.length > 0) {
    const slice = compressed.slice(0, 1024);
    writer.write(slice);
    compressed = compressed.slice(1024);
    compressedSize += slice.length;
  }

  writer.close();

  return {
    stream: passthrough.readable,
    size: compressedSize,
  };
}

async function compressDeflate(
  stream: Stream,
  options: UnservedConfig["compression"]["deflate"]
): Promise<CompressResult> {
  const passthrough = new TransformStream<StreamData>();
  const writer = passthrough.writable.getWriter();

  let compressedSize: number = 0;
  const bytes = await readableStreamToBytes(stream);
  let compressed = deflateSync(bytes, {
    level: options.level,
    memLevel: options.memLevel,
    windowBits: options.windowBits,
  });
  while (compressed.length > 0) {
    const slice = compressed.slice(0, 1024);
    writer.write(slice);
    compressed = compressed.slice(1024);
    compressedSize += slice.length;
  }
  writer.close();

  return {
    stream: passthrough.readable,
    size: compressedSize,
  };
}

function getFloat(str: string | undefined): number | undefined {
  if (str === undefined) return undefined;
  try {
    return parseFloat(str);
  } catch {
    return undefined;
  }
}

function extractEncodings(acceptEncoding?: string): Encoding[] {
  const encodings = acceptEncoding?.replace(/\s/g, "").split(",") ?? [];
  return encodings.map((encoding) => {
    const [key, priority] = encoding.split(";q=");
    return {
      key: key!,
      priority: getFloat(priority),
    };
  });
}

export const compressionMiddleware = (
  options: CompressionMiddlewareOptions
) => {
  return async (c: Context, next: Next) => {
    if (!options.enabled) return next();
    const mimeType = c.get("mimeType");
    let size = c.get("size");
    let stream = c.get("stream");
    if (!mimeType || !size || !stream) return next();

    const isAllowed = isOneOfMimeTypes(mimeType, options.mimeTypes);
    if (!isAllowed) return next();

    let encoding: "identity" | "gzip" | "deflate" | "br" = "identity";
    let outputSize: number = size;
    const acceptedEncodings = extractEncodings(
      c.req.header("Accept-Encoding")
    ).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    let encoded: boolean = false;
    for await (const acceptedEncoding of acceptedEncodings) {
      switch (acceptedEncoding.key) {
        case "br": {
          if (!options.brotli.enabled) break;
          const result = await compressBrotli(
            stream,
            mimeType,
            size,
            options.brotli
          );
          stream = result.stream;
          size = result.size;
          encoding = "br";
          encoded = true;
          break;
        }
        case "gzip": {
          if (!options.gzip.enabled) break;
          const result = await compressGzip(stream, options.gzip);
          stream = result.stream;
          size = result.size;
          encoding = "gzip";
          encoded = true;
          break;
        }
        case "deflate": {
          if (!options.deflate.enabled) break;
          const result = await compressDeflate(stream, options.deflate);
          stream = result.stream;
          size = result.size;
          encoding = "deflate";
          encoded = true;
          break;
        }
      }
      if (encoded) break;
    }

    c.set("headerMap", {
      ...c.get("headerMap"),
      "Content-Encoding": encoding,
      "Content-Length": size.toString(),
    });
    c.set("stream", stream);
    c.set("size", size);
    return next();
  };
};
