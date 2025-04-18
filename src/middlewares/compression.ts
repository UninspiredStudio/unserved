import type { Context, Next } from "hono";
import { gzipSync, deflateSync } from "bun";
import { brotliCompressSync, constants } from "node:zlib";
import type { Stream, StreamData } from "../utils/stream";
import type { UnservedConfig } from "../utils/config";

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
  // @ts-ignore
  for await (const chunk of stream) {
    const compressed = gzipSync(chunk, {
      level: options.level,
      memLevel: options.memLevel,
      windowBits: options.windowBits,
    });
    compressedSize += compressed.length;
    writer.write(compressed);
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
  // @ts-ignore
  for await (const chunk of stream) {
    const compressed = brotliCompressSync(chunk, {
      params: {
        [constants.BROTLI_PARAM_SIZE_HINT]: size,
        [constants.BROTLI_PARAM_MODE]: mode,
        [constants.BROTLI_PARAM_QUALITY]: options.quality,
      },
    });
    compressedSize += compressed.length;
    writer.write(compressed);
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
  // @ts-ignore
  for await (const chunk of stream) {
    const compressed = deflateSync(chunk, {
      level: options.level,
      memLevel: options.memLevel,
      windowBits: options.windowBits,
    });
    compressedSize += compressed.length;
    writer.write(compressed);
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
    const file = c.get("file");
    if (!file) return next();

    let outputStream: Stream = file.stream();
    let encoding: "identity" | "gzip" | "deflate" | "br" = "identity";
    let outputSize: number = file.size;
    const acceptedEncodings = extractEncodings(
      c.req.header("Accept-Encoding")
    ).sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    let encoded: boolean = false;
    for await (const acceptedEncoding of acceptedEncodings) {
      switch (acceptedEncoding.key) {
        case "br": {
          const result = await compressBrotli(
            outputStream,
            file.type,
            file.size,
            options.brotli
          );
          outputStream = result.stream;
          outputSize = result.size;
          encoding = "br";
          encoded = true;
          break;
        }
        case "gzip": {
          const result = await compressGzip(outputStream, options.gzip);
          outputStream = result.stream;
          outputSize = result.size;
          encoding = "gzip";
          encoded = true;
          break;
        }
        case "deflate": {
          const result = await compressDeflate(outputStream, options.deflate);
          outputStream = result.stream;
          outputSize = result.size;
          encoding = "deflate";
          encoded = true;
        }
      }
      if (encoded) break;
    }

    c.res.headers.set("Content-Encoding", encoding);
    c.res.headers.set("Content-Length", outputSize.toString());
    c.set("stream", outputStream);
    return next();
  };
};
