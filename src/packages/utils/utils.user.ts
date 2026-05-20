import type { User } from "../../types/auth";
import { hashPassword } from "./utils.password";
import { envDefaultUserConfig } from "../env/env.user";
import type { UserRole } from "../configs/config.roles";

// DEFAULT USER
export interface DefaultUser extends User {
  password: string;
}

// CREATE DEFAULT USER
export const createDefaultUser = async (role?: UserRole): Promise<DefaultUser> => {
  const hashedPassword = await hashPassword(envDefaultUserConfig.DEFAULT_USER_PASSWORD);

  const timestamp = new Date().toISOString();

  return {
    id: envDefaultUserConfig.DEFAULT_USER_ID,

    fullname: envDefaultUserConfig.DEFAULT_USER_FULLNAME,

    email: envDefaultUserConfig.DEFAULT_USER_EMAIL,

    password: hashedPassword,

    role: role ?? envDefaultUserConfig.DEFAULT_USER_ROLE,

    is_verified: true,

    avatar_url: envDefaultUserConfig.DEFAULT_USER_AVATAR_URL,

    created_at: timestamp,

    updated_at: timestamp,
  };
};
