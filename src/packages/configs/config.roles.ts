export const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
} as const;

export type UserRole = keyof typeof UserRoles;
