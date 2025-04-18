import { resolve } from "node:path";
import { rmdir } from "node:fs/promises";

async function clean() {
  console.log("Cleaning...");
  await Promise.all([
    async () => {
      try {
        await rmdir(resolve(import.meta.dir, "..", "dist"), {
          recursive: true,
        });
      } catch {
        console.log("dist does not exist, skipping");
      }
    },
    async () => {
      try {
        await rmdir(resolve(import.meta.dir, "..", "bin"), { recursive: true });
      } catch {
        console.log("bin does not exist, skipping");
      }
    },
  ]);
}

clean()
  .then(() => {
    console.log("Cleaned");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
