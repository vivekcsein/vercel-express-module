import type { User } from "../../types/auth";
import { hashPassword } from "./utils.password";
import { UserRole } from "../configs/config.roles";
import { envDefaultUserConfig } from "../env/env.user";

export interface DefaultUser extends User {
  password: string;
}

// CREATE DEFAULT USER
export const createDefaultUser = async (Role?: UserRole): Promise<DefaultUser> => {
  const hashedPassword = await hashPassword(envDefaultUserConfig.DEFAULT_USER_PASSWORD);
  const timestamp = new Date().toISOString();

  return {
    id: envDefaultUserConfig.DEFAULT_USER_ID,
    fullname: envDefaultUserConfig.DEFAULT_USER_FULLNAME,
    email: envDefaultUserConfig.DEFAULT_USER_EMAIL,
    password: hashedPassword,
    role: Role ?? envDefaultUserConfig.DEFAULT_USER_ROLE,
    is_verified: true,
    avatar_url: envDefaultUserConfig.DEFAULT_USER_AVATAR_URL,
    created_at: timestamp,
    updated_at: timestamp,
  };
};

//   USERS STORE - In-memory array to hold users (including default user)
export const usersStore: DefaultUser[] = [];

// Initialize default user
export const initUsersStore = async (): Promise<void> => {
  const defaultUser = await createDefaultUser();
  usersStore.push(defaultUser);
};

// FIND USER BY EMAIL
export const findUserByEmail = (email: string): DefaultUser | undefined => {
  return usersStore.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

// FIND USER BY ID
export const findUserById = (id: string): DefaultUser | undefined => {
  return usersStore.find((user) => user.id === id);
};

// CREATE USER
export const createUser = async (user: DefaultUser): Promise<DefaultUser> => {
  usersStore.push(user);
  return user;
};
