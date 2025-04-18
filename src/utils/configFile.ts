import { join, relative } from "node:path";
import { file } from "bun";
import {
  unservedConfigSchemaPartial,
  type UnservedConfigPartial,
} from "./config";

const unservedConfigPathJson = join(process.cwd(), "unserved.json");
const unservedConfigPathToml = join(process.cwd(), "unserved.toml");

export async function findConfig(): Promise<string | null> {
  const [existsJson, existsToml] = await Promise.all([
    file(unservedConfigPathJson).exists(),
    file(unservedConfigPathToml).exists(),
  ]);
  if (existsToml) {
    return unservedConfigPathToml;
  }
  if (existsJson) {
    return unservedConfigPathJson;
  }
  return null;
}

interface ConfigResult {
  configFile?: string;
  config: UnservedConfigPartial;
}

let unservedConfig: ConfigResult | null = null;

export async function loadUnservedConfig(): Promise<ConfigResult> {
  if (unservedConfig) return unservedConfig;
  const foundConfig = await findConfig();
  if (!foundConfig) {
    return {
      configFile: undefined,
      config: unservedConfigSchemaPartial.parse({}),
    };
  }
  const configContent = await import(foundConfig);
  return {
    configFile: relative(process.cwd(), foundConfig),
    config: unservedConfigSchemaPartial.parse(configContent),
  };
}
