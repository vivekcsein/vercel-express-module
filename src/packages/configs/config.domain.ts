import { envClientConfig } from "../env/env.client";

export const allowedMailDomains = ["gmail.com", "hotmail.com", "outlook.com"];

export const allowedOriginsList = [envClientConfig.CLIENT_URL].filter(Boolean);

// Load allowed origins from env or fallback
export const allowedOrigins =
  envClientConfig.CLIENT_URL?.split(",").map((o) => o.trim()) || allowedOriginsList;
