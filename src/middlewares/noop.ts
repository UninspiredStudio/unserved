import type { Context, Next } from "hono";

export const noopMiddleware = async () => {
  return async (_: Context, next: Next) => {
    return next();
  };
};
