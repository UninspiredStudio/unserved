import { resolve } from "node:path";

async function main() {
  console.log("Adding shebang");
  const binFile = Bun.file(resolve(import.meta.dir, "..", "bin/server.js"));
  const content = await binFile.text();
  await binFile.write(`#!/usr/bin/env bun\n${content}`);
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
