import type { Context } from "hono";
import { cloneStream, type Stream } from "../utils/stream";
import { readableStreamToBytes } from "bun";
import { headersToObject, objectToHeaders } from "../utils/headers";

export interface RenderMiddlewareOptions {}

async function splitStream(stream: Stream) {
  const [returnStream, blobStream] = await cloneStream(stream);

  const bytes = await readableStreamToBytes(blobStream);

  return {
    bytes,
    stream: returnStream,
  };
}

export const renderMiddleware = (options: RenderMiddlewareOptions = {}) => {
  return async (c: Context) => {
    const outputStream = c.get("stream");
    if (!outputStream) return new Response("Not Found", { status: 404 });
    const { bytes, stream } = await splitStream(outputStream);
    c.set("bytes", bytes);
    const headerMap = c.get("headerMap");
    return new Response(stream, {
      headers: headerMap,
    });
  };
};
