import { spawn, type BuildConfig } from "bun";
import { resolve } from "node:path";

const sharedOptions: Omit<BuildConfig, "entrypoints"> = {
  target: "bun",
  packages: "external",
  sourcemap: "linked",
  minify: true,
  splitting: true,
};

async function buildEsm() {
  await Bun.build({
    ...sharedOptions,
    entrypoints: ["src/index.ts"],
    outdir: "dist/esm",
    format: "esm",
  });
}

async function buildCjs() {
  await Bun.build({
    ...sharedOptions,
    entrypoints: ["src/index.ts"],
    outdir: "dist/cjs",
    format: "cjs",
  });
}

async function buildTypes() {
  return new Promise<void>((res, rej) => {
    spawn(["tsc", "-p", "tsconfig.build.json"], {
      cwd: resolve(import.meta.dir, ".."),
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
      onExit: (proc, exitCode, signalCode, error) => {
        if (exitCode !== 0) {
          console.error("tsc failed with code", exitCode);
          rej(new Error("tsc failed"));
        } else {
          console.log("tsc succeeded");
          res();
        }
      },
    });
  });
}

async function buildBin() {
  await Bun.build({
    ...sharedOptions,
    entrypoints: ["src/server.ts"],
    outdir: "bin",
    format: "esm",
  });
}

async function build() {
  await Promise.all([
    await buildEsm(),
    await buildCjs(),
    await buildBin(),
    await buildTypes(),
  ]);
}

build()
  .then(() => {
    console.log("Build successful");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
