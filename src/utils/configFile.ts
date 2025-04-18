import path, { join, resolve } from "node:path";
import { file } from "bun";
import {
  unservedConfigSchemaPartial,
  type UnservedConfigPartial,
} from "./config";

export const CONFIG_FILE_JSON = "unserved.json" as const;
export const CONFIG_FILE_TOML = "unserved.toml" as const;

export async function findConfig(configPath?: string): Promise<string | null> {
  // configPath can be either a path to a file or a directory
  // if it's a directory, we need to check for the config file in the directory

  let path = configPath ?? process.cwd();
  if (
    [CONFIG_FILE_JSON, CONFIG_FILE_TOML].some((file) => path.endsWith(file))
  ) {
    path = path.replace(CONFIG_FILE_JSON, "").replace(CONFIG_FILE_TOML, "");
  }
  const jsonPath = join(path, CONFIG_FILE_JSON);
  const tomlPath = join(path, CONFIG_FILE_TOML);
  const [existsJson, existsToml] = await Promise.all([
    file(jsonPath).exists(),
    file(tomlPath).exists(),
  ]);
  if (existsToml) {
    return resolve(tomlPath);
  }
  if (existsJson) {
    return resolve(jsonPath);
  }
  return null;
}

interface ConfigResult {
  configFile?: string;
  config: UnservedConfigPartial;
}

export async function loadUnservedConfig(
  configPath?: string
): Promise<ConfigResult> {
  const foundConfig = await findConfig(configPath);
  if (!foundConfig) {
    return {
      configFile: undefined,
      config: unservedConfigSchemaPartial.parse({}),
    };
  }
  const configContent = await import(foundConfig);
  return {
    configFile: foundConfig,
    config: unservedConfigSchemaPartial.parse(configContent),
  };
}
