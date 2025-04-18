import { parseArgs } from "node:util";
import { resolve } from "node:path";
import semverInc from "semver/functions/inc";
import type { ReleaseType } from "semver";

function isType(type: string): type is ReleaseType {
  return [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease",
    "release",
  ].includes(type);
}

async function main() {
  const packageJsonPath = resolve(import.meta.dir, "..", "package.json");
  const packageJsonFile = Bun.file(packageJsonPath);
  if (!(await packageJsonFile.exists())) {
    throw new Error("package.json not found");
  }
  const packageJson = await packageJsonFile.json();
  const version = packageJson.version;

  const {
    values: { type: releaseType },
  } = parseArgs({
    options: {
      type: {
        type: "string",
        short: "t",
        default: "patch",
      },
    },
    allowPositionals: true,
    allowNegativeNumbers: false,
  });

  if (!isType(releaseType)) {
    throw new Error(`Invalid version type: ${releaseType}`);
  }

  const newVersion = semverInc(
    version,
    releaseType,
    releaseType === "prerelease" ? "beta" : undefined
  );

  packageJson.version = newVersion;
  await packageJsonFile.write(JSON.stringify(packageJson, null, 2));
  return newVersion;
}

main()
  .then((newVersion) => {
    console.log(newVersion);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
