import { JwtPayload } from "../../../../packages/utils/utils.jwt";
import { passwords, users } from "../../../../packages/db/db.local";
import { generateUUID } from "../../../../packages/utils/utils.crypto";
import { createAuthTokens, revokeRefreshToken } from "./services.token";
import { envDefaultUserConfig } from "../../../../packages/env/env.user";
import { AppError, asyncProvider } from "../../../../packages/utils/utils.handler";
import { SigninCredentials, SignupCredentials, User } from "../../../../types/auth";
import { comparePasswords, hashPassword } from "../../../../packages/utils/utils.password";

// REGISTER USER
export const registerUser = async (credentials: SignupCredentials) => {
  return asyncProvider(
    async () => {
      const existingUser = Array.from(users.values()).find(
        (user) => user.email === credentials.email
      );

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

      users.set(userId, user);

      passwords.set(userId, hashedPassword);

      const tokenPayload: JwtPayload = {
        id: user.id,

        email: user.email,

        fullname: user.fullname,

        role: user.role,

        is_verified: user.is_verified,
      };

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
      const user = Array.from(users.values()).find(
        (currentUser) => currentUser.email === credentials.email
      );

      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      const hashedPassword = passwords.get(user.id);

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
