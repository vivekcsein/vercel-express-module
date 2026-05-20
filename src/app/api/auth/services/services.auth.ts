import { generateUUID } from "../../../../packages/utils/utils.crypto";
import { envDefaultUserConfig } from "../../../../packages/env/env.user";
import { AppError, asyncProvider } from "../../../../packages/utils/utils.handler";
import { SigninCredentials, SignupCredentials, User } from "../../../../types/auth";
import { comparePasswords, hashPassword } from "../../../../packages/utils/utils.password";

import {
  createAuthTokens,
  getUserActiveSessions,
  revokeAllUserTokens,
  revokeRefreshToken,
  rotateRefreshToken,
} from "./services.token";

import {
  generateEmailVerificationToken,
  JwtPayload,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
} from "../../../../packages/utils/utils.jwt";

import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserById,
  getUserPassword,
  updateUser,
  updateUserPassword,
} from "../../../../packages/repository/repository.local";

// REGISTER USER
export const registerUser = async (credentials: SignupCredentials) => {
  return asyncProvider(
    async () => {
      const existingUser = findUserByEmail(credentials.email);

      if (existingUser) {
        throw new AppError("User already exists", 409);
      }

      const hashedPassword = await hashPassword(credentials.password);

      const userId = generateUUID();

      const user: User = {
        id: userId,

        email: credentials.email,

        fullname: credentials.fullname,

        role: envDefaultUserConfig.DEFAULT_USER_ROLE,

        is_verified: false,

        created_at: new Date().toISOString(),

        updated_at: new Date().toISOString(),
      };

      const tokenPayload: JwtPayload = {
        id: user.id,

        email: user.email,

        fullname: user.fullname,

        role: user.role,

        is_verified: user.is_verified,
      };

      await createUser({
        user,
        hashedPassword,
      });

      const tokens = await createAuthTokens(tokenPayload);

      // const verificationToken = generateEmailVerificationToken(tokenPayload);

      // const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

      // if(envAppConfig.ENABLE_SMTP){
      //   await sendVerificationEmail({
      //     email: user.email,
      //     verificationUrl,
      //   });
      // }

      return {
        user,
        ...tokens,
      };
    },

    "Failed to register user"
  );
};

// LOGIN USER
export const loginUser = async (credentials: SigninCredentials) => {
  return asyncProvider(
    async () => {
      const user = findUserByEmail(credentials.email);

      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      const hashedPassword = getUserPassword(user.id);

      if (!hashedPassword) {
        throw new AppError("Invalid credentials", 401);
      }

      await comparePasswords({
        hashedPassword,

        plainPassword: credentials.password,
      });

      const tokenPayload: JwtPayload = {
        id: user.id,

        email: user.email,

        fullname: user.fullname,

        role: user.role,

        is_verified: user.is_verified,
      };

      const tokens = await createAuthTokens(tokenPayload);

      return {
        user,
        ...tokens,
      };
    },

    "Failed to login user"
  );
};

// LOGOUT USER
export const logoutUser = async ({ refreshToken }: { refreshToken: string }): Promise<void> => {
  return asyncProvider(
    async () => {
      await revokeRefreshToken(refreshToken);
    },

    "Failed to logout user"
  );
};

// LOGOUT ALL USER SESSIONS
export const logoutAllUserSessions = async (userId: string): Promise<void> => {
  return asyncProvider(
    async () => {
      await revokeAllUserTokens(userId);
    },

    "Failed to logout all sessions"
  );
};

// REFRESH ACCESS TOKEN
export const refreshUserAccessToken = async (refreshToken: string) => {
  return asyncProvider(
    async () => {
      return await rotateRefreshToken({
        refreshToken,
      });
    },

    "Failed to refresh session"
  );
};

// VERIFY USER EMAIL
export const verifyUserEmail = async (token: string): Promise<void> => {
  return asyncProvider(
    async () => {
      const payload = verifyEmailVerificationToken(token);

      const user = findUserById(payload.id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      user.is_verified = true;

      user.updated_at = new Date().toISOString();

      updateUser(user);
    },

    "Failed to verify email"
  );
};

// RESEND VERIFICATION EMAIL
export const resendVerification = async (userId: string): Promise<void> => {
  return asyncProvider(
    async () => {
      const user = findUserById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const token = generateEmailVerificationToken({
        id: user.id,

        email: user.email,

        fullname: user.fullname,

        role: user.role,

        is_verified: user.is_verified,
      });

      if (process.env.NODE_ENV === "development") {
        console.log(token);
      }

      // const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

      // if(envAppConfig.ENABLE_SMTP){
      //   await sendVerificationEmail({
      //     email: user.email,
      //     verificationUrl,
      //   });
      // }
    },

    "Failed to resend verification email"
  );
};

// FORGOT PASSWORD
export const forgotUserPassword = async (email: string): Promise<void> => {
  return asyncProvider(
    async () => {
      const user = findUserByEmail(email);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // const token = generatePasswordResetToken({
      //   id: user.id,

      //   email: user.email,

      //   fullname: user.fullname,

      //   role: user.role,

      //   is_verified: user.is_verified,
      // });

      // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

      // await sendPasswordResetEmail({
      //   email: user.email,

      //   resetUrl,
      // });
    },

    "Failed to send password reset email"
  );
};

// RESET USER PASSWORD
export const resetUserPassword = async ({
  token,
  password,
}: {
  token: string;

  password: string;
}): Promise<void> => {
  return asyncProvider(
    async () => {
      const payload = verifyPasswordResetToken(token);

      const user = findUserById(payload.id);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const hashedPassword = await hashPassword(password);
      updateUserPassword({
        userId: user.id,
        hashedPassword,
      });

      user.updated_at = new Date().toISOString();
      updateUser(user);

      await revokeAllUserTokens(user.id);
    },

    "Failed to reset password"
  );
};

// UPDATE USER PROFILE
export const updateUserProfile = async ({
  userId,
  data,
}: {
  userId: string;

  data: Partial<User>;
}): Promise<User> => {
  return asyncProvider(
    async () => {
      const user = findUserById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const updatedUser: User = {
        ...user,

        ...data,

        updated_at: new Date().toISOString(),
      };
      updateUser(updatedUser);

      return updatedUser;
    },

    "Failed to update profile"
  );
};

// UPDATE USER PASSWORD
export const updateUserCurrentPassword = async ({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;

  currentPassword: string;

  newPassword: string;
}): Promise<void> => {
  return asyncProvider(
    async () => {
      const user = findUserById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      const hashedPassword = getUserPassword(user.id);

      if (!hashedPassword) {
        throw new AppError("Invalid credentials", 401);
      }

      await comparePasswords({
        hashedPassword,

        plainPassword: currentPassword,
      });

      const newHashedPassword = await hashPassword(newPassword);

      updateUserPassword({
        userId: user.id,
        hashedPassword: newHashedPassword,
      });

      user.updated_at = new Date().toISOString();
      updateUser(user);

      await revokeAllUserTokens(user.id);
    },

    "Failed to update password"
  );
};

// DELETE USER ACCOUNT
export const deleteUserAccount = async (userId: string): Promise<void> => {
  return asyncProvider(
    async () => {
      const user = findUserById(userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }
      deleteUser(userId);

      await revokeAllUserTokens(userId);
    },

    "Failed to delete account"
  );
};

// GET USER SESSIONS
export const getUserSessions = async (userId: string) => {
  return asyncProvider(
    async () => {
      return await getUserActiveSessions(userId);
    },

    "Failed to get user sessions"
  );
};

// REVOKE USER SESSION
export const revokeUserSession = async ({
  sessionId,
}: {
  userId: string;

  sessionId: string;
}): Promise<void> => {
  return asyncProvider(
    async () => {
      await revokeRefreshToken(sessionId);
    },

    "Failed to revoke session"
  );
};
