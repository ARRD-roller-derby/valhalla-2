import { z } from "zod";

export const serverScheme = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_ID: z.string(),
  DISCORD_SECRET: z.string(),
  DISCORD_TOKEN: z.string(),
  DISCORD_GUILD_ID: z.string(),
  AUTH_SECRET: z.string(),
  AUTH_TRUST_HOST: z.string().optional(),
  AUTH_URL: z.string().optional(),
  DOLIBARR_URL: z.string().optional(),
  DOLIBARR_API_KEY: z.string().optional(),
  API_KEY: z.string(),
  URL_V1: z.string(),
});

export const clientScheme = z.object({
  MODE: z.enum(['development', 'production', 'test']).default('development'),
  VITE_AUTH_PATH: z.string().optional(),
});
