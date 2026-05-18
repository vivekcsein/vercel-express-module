import { z } from "zod";
import argon2 from "argon2";
import { AppError } from "./utils.handler";
import { passwordRules } from "../configs/config.schema";

// PASSWORD HASH OPTIONS
const PASSWORD_HASH_OPTIONS: argon2.Options & Required<Pick<argon2.Options, "type">> = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

// VALIDATE PASSWORD POLICY
// Wrapper that preserves AppError behavior
export const validatePassword = (password: string): void => {
  try {
    passwordRules.parse(password);
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Throw AppError with the same message and status code
      const message = err.message as string;
      throw new AppError(message, 400);
    }
    throw err;
  }
};

// HASH PASSWORD
export const hashPassword = async (password: string): Promise<string> => {
  validatePassword(password);
  return await argon2.hash(password, PASSWORD_HASH_OPTIONS);
};

// VERIFY PASSWORD
export const verifyPassword = async ({
  hashedPassword,
  plainPassword,
}: {
  hashedPassword: string;
  plainPassword: string;
}): Promise<boolean> => {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error: unknown) {
    throw new AppError("Failed to verify password", 500, error as boolean);
  }
};

// SAFE PASSWORD CHECK
export const comparePasswords = async ({
  hashedPassword,
  plainPassword,
}: {
  hashedPassword: string;
  plainPassword: string;
}): Promise<void> => {
  const isValid = await verifyPassword({
    hashedPassword,
    plainPassword,
  });

  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }
};
