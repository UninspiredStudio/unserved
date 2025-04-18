import * as z from "@zod/mini";
import { loadUnservedConfig } from "./configFile";
import { getEnvConfig } from "./env";
import { getOptions } from "./options";
import { defaults as defaultsConfig } from "./defaults";
import merge from "lodash.merge";

const zlibConfigurationOptions = {
  level: z.union([
    z.literal(-1),
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
  ]),
  memLevel: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
  ]),
  windowBits: z.union([
    z.literal(-9),
    z.literal(-10),
    z.literal(-11),
    z.literal(-12),
    z.literal(-13),
    z.literal(-14),
    z.literal(-15),
    z.literal(9),
    z.literal(10),
    z.literal(11),
    z.literal(12),
    z.literal(13),
    z.literal(14),
    z.literal(15),
    z.literal(25),
    z.literal(26),
    z.literal(27),
    z.literal(28),
    z.literal(29),
    z.literal(30),
    z.literal(31),
  ]),
};

const brotliConfigurationOptions = {
  quality: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
    z.literal(10),
    z.literal(11),
  ]),
};

const serverConfigSchema = z.object({
  development: z.boolean(),
  port: z.number(),
  hostname: z.string(),
  publicUrl: z.optional(z.string()),
  serveHiddenFiles: z.boolean(),
  secureHeaders: z.boolean(),
  log: z.boolean(),
  autoport: z.boolean(),
  configPath: z.string(),
});

const pathsConfigSchema = z.object({
  root: z.string(),
  basePath: z.string(),
  spaMode: z.boolean(),
  directoryIndex: z.boolean(),
});

const cacheConfigSchema = z.object({
  enabled: z.boolean(),
  mimeTypes: z.array(z.string()),
});

const etagConfigSchema = z.object({
  enabled: z.boolean(),
  maxAge: z.number(),
});

const corsConfigSchema = z.object({
  enabled: z.boolean(),
  origin: z.array(z.string()),
  allowHeaders: z.array(z.string()),
  allowMethods: z.array(z.string()),
  exposeHeaders: z.array(z.string()),
  credentials: z.boolean(),
  maxAge: z.number(),
});

const csrfConfigSchema = z.object({
  enabled: z.boolean(),
  origin: z.array(z.string()),
});

export const unservedConfigSchema = z.object({
  server: serverConfigSchema,
  paths: pathsConfigSchema,
  cache: cacheConfigSchema,
  etag: etagConfigSchema,
  compression: z.object({
    enabled: z.boolean(),
    mimeTypes: z.array(z.string()),
    gzip: z.object({
      enabled: z.boolean(),
      ...zlibConfigurationOptions,
    }),
    brotli: z.object({
      enabled: z.boolean(),
      ...brotliConfigurationOptions,
    }),
    deflate: z.object({
      enabled: z.boolean(),
      ...zlibConfigurationOptions,
    }),
  }),
  cors: corsConfigSchema,
  csrf: csrfConfigSchema,
});

export type UnservedConfig = z.infer<typeof unservedConfigSchema>;

export const unservedConfigSchemaPartial = z.partial(
  z.object({
    server: z.partial(serverConfigSchema),
    paths: z.partial(pathsConfigSchema),
    cache: z.partial(cacheConfigSchema),
    etag: z.partial(etagConfigSchema),
    compression: z.partial(
      z.object({
        enabled: z.boolean(),
        mimeTypes: z.array(z.string()),
        gzip: z.partial(
          z.object({
            enabled: z.boolean(),
            ...zlibConfigurationOptions,
          })
        ),
        brotli: z.partial(
          z.object({
            enabled: z.boolean(),
            ...brotliConfigurationOptions,
          })
        ),
        deflate: z.partial(
          z.object({
            enabled: z.boolean(),
            ...zlibConfigurationOptions,
          })
        ),
      })
    ),
    cors: z.partial(corsConfigSchema),
    csrf: z.partial(csrfConfigSchema),
  })
);
export type UnservedConfigPartial = z.infer<typeof unservedConfigSchemaPartial>;

export async function getConfig(): Promise<{
  configFile?: string;
  config: UnservedConfig;
}> {
  const envConfig = getEnvConfig();
  const optionsConfig = getOptions();
  const { configFile, config: configFileConfig } = await loadUnservedConfig(
    (envConfig as any).server?.configPath ??
      (optionsConfig as any).server?.configPath ??
      defaultsConfig.server.configPath
  );

  const config = merge(
    defaultsConfig,
    envConfig,
    configFileConfig,
    optionsConfig
  );

  return {
    configFile: configFile,
    config: unservedConfigSchema.parse(config),
  };
}
