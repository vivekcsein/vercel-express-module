import bcrypt from "bcryptjs";
import type { User } from "../../types/auth";
import { envDefaultUserConfig } from "../env/env.user";

export interface DefaultUser extends User {
  password: string;
}

// CREATE DEFAULT USER
const createDefaultUser = (): DefaultUser => {
  // ✅ Hash password
  const hashedPassword = bcrypt.hashSync(envDefaultUserConfig.DEFAULT_USER_PASSWORD, 10);

  const timestamp = new Date().toISOString();

  return {
    id: envDefaultUserConfig.DEFAULT_USER_ID,

    fullname: envDefaultUserConfig.DEFAULT_USER_FULLNAME,

    email: envDefaultUserConfig.DEFAULT_USER_EMAIL,

    password: hashedPassword,

    role: "ADMIN",

    is_verified: true,

    avatar_url: null,

    created_at: timestamp,

    updated_at: timestamp,
  };
};

//   USERS STORE - In-memory array to hold users (including default user)
export const usersStore: DefaultUser[] = [createDefaultUser()];

//  USER HELPERS
export const findUserByEmail = (email: string): DefaultUser | undefined => {
  return usersStore.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id: string): DefaultUser | undefined => {
  return usersStore.find((user) => user.id === id);
};

export const createUser = async (user: DefaultUser): Promise<DefaultUser> => {
  usersStore.push(user);

  return user;
};
