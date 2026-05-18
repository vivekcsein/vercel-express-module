import crypto from "node:crypto";

// GENERATE UUID
export const generateUUID = (): string => {
  return crypto.randomUUID();
};

// GENERATE RANDOM TOKEN
export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};

// HASH STRING
export const hashString = (value: string): string => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

// GENERATE NUMERIC OTP
export const generateOTP = (length = 6): string => {
  const digits = "0123456789";

  let otp = "";

  for (let index = 0; index < length; index++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
};

// GENERATE API KEY
export const generateApiKey = (): string => {
  return `sk_${generateRandomToken(32)}`;
};

// GENERATE SESSION ID
export const generateSessionId = (): string => {
  return `sess_${generateUUID()}`;
};

// HASH TOKEN
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
