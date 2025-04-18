export type StreamData = Uint8Array<ArrayBufferLike>;
export type Stream = ReadableStream<StreamData>;

export async function cloneStream(stream: Stream): Promise<[Stream, Stream]> {
  const output1 = new TransformStream<StreamData>();
  const output2 = new TransformStream<StreamData>();

  const writer1 = output1.writable.getWriter();
  const writer2 = output2.writable.getWriter();
  // @ts-ignore
  for await (const chunk of stream) {
    writer1.write(chunk);
    writer2.write(chunk);
  }
  writer1.close();
  writer2.close();

  return [output1.readable, output2.readable];
}
