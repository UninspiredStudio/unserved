import { createServer } from "node:net";

export function isPortInUse(
  port: number,
  callback: (isInUse: boolean) => void
): void {
  const server = createServer((socket) => {
    socket.write("Echo server\r\n");
    socket.pipe(socket);
  });
  server.on("error", () => callback(true));
  server.on("listening", () => (server.close(), callback(false)));
  server.listen(port, "127.0.0.1");
}

export function getNextAvailablePort(port: number): Promise<number> {
  return new Promise((resolve) => {
    isPortInUse(port, (isInUse) => {
      if (isInUse) {
        console.log(`Port ${port} is in use, trying ${port + 1}`);
        resolve(getNextAvailablePort(port + 1));
      } else {
        resolve(port);
      }
    });
  });
}
