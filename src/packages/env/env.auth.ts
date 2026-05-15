import { z } from "zod";

// ✅ Schema uses the actual env var names (with NEXT_PUBLIC_ prefix)
const envConfigSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(10).default("jwt-access-secret"),
  JWT_REFRESH_SECRET: z.string().min(10).default("jwt-refresh-secret"),
  
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("1d"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("30d"),

  COOKIE_SECRET: z.string().min(10).default("cookie-secret"),
  COOKIE_SECURE: z.boolean().default(true),
  COOKIE_HTTP_ONLY: z.boolean().default(true),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),

  // ✅ Optional: Better Auth
  BETTER_AUTH_URL: z.string().default("http://localhost:7164"),
  BETTER_AUTH_SECRET: z.string().min(10).default("better-auth-secret"),

});

// ✅ Validate process.env
const parsed = envConfigSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `❌ Invalid Auth environment variables:\n${parsed.error.issues
      .map((i) => `• ${i.path.join(".")}: ${i.message}`)
      .join("\n")}`
  );
}

// ✅ Map validated vars to clean keys
export const envAuthConfig = Object.freeze(parsed.data);

// ✅ Optional: Type-safe config
export type EnvAuthConfig = typeof envAuthConfig;
