// auth/utils/auth.token.ts

import { AppError } from "../../../../packages/utils/utils.handler";
import { hashToken } from "../../../../packages/utils/utils.crypto";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getSessionTimer,
  type JwtPayload,
} from "../../../../packages/utils/utils.jwt";

// REFRESH TOKEN STORE
// TEMPORARY IN-MEMORY STORE
// LATER MOVE TO:
// - REDIS
// - DATABASE
// - DRIZZLE SESSION TABLE
const refreshTokenStore = new Map<
  string,
  {
    user_id: string;

    token_hash: string;

    created_at: number;

    expires_at: number;

    revoked: boolean;
  }
>();

// CREATE ACCESS TOKEN
export const createAccessToken = (
  payload: JwtPayload
): {
  access_token: string;

  session: {
    expires_at: number | null;

    expires_in: number;
  };
} => {
  const accessToken = generateAccessToken(payload);

  const session = getSessionTimer(accessToken);

  return {
    access_token: accessToken,

    session,
  };
};

// CREATE REFRESH TOKEN
export const createRefreshToken = async (
  payload: JwtPayload
): Promise<{
  refresh_token: string;
  expires_at: number;
}> => {
  const refreshToken = generateRefreshToken(payload);

  const tokenHash = hashToken(refreshToken);

  const session = getSessionTimer(refreshToken);

  refreshTokenStore.set(tokenHash, {
    user_id: payload.id,

    token_hash: tokenHash,

    created_at: Date.now(),

    expires_at: session.expires_at ?? 0,

    revoked: false,
  });

  return {
    refresh_token: refreshToken,
    expires_at: session.expires_at ?? 0,
  };
};

// CREATE AUTH TOKENS
export const createAuthTokens = async (
  payload: JwtPayload
): Promise<{
  access_token: string;

  refresh_token: string;

  session: {
    expires_at: number | null;

    expires_in: number;
  };
}> => {
  const access = createAccessToken(payload);

  const refresh = await createRefreshToken(payload);

  return {
    access_token: access.access_token,

    refresh_token: refresh.refresh_token,

    session: access.session,
  };
};

// VALIDATE REFRESH TOKEN
export const validateRefreshToken = async (refreshToken: string): Promise<JwtPayload> => {
  const tokenHash = hashToken(refreshToken);

  const storedToken = refreshTokenStore.get(tokenHash);

  if (!storedToken) {
    throw new AppError("Refresh token reuse detected", 401);
  }

  if (storedToken.revoked) {
    throw new AppError("Refresh token revoked", 401);
  }

  if (storedToken.expires_at < Date.now()) {
    refreshTokenStore.delete(tokenHash);

    throw new AppError("Refresh token expired", 401);
  }

  return verifyRefreshToken(refreshToken);
};

// ROTATE REFRESH TOKEN
export const rotateRefreshToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<{
  access_token: string;

  refresh_token: string;

  session: {
    expires_at: number | null;

    expires_in: number;
  };
}> => {
  const payload = await validateRefreshToken(refreshToken);

  await revokeRefreshToken(refreshToken);

  return await createAuthTokens(payload);
};

// REVOKE REFRESH TOKEN
export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
  const tokenHash = hashToken(refreshToken);

  const storedToken = refreshTokenStore.get(tokenHash);

  if (!storedToken) {
    return;
  }

  storedToken.revoked = true;

  refreshTokenStore.set(tokenHash, storedToken);
};

// REVOKE ALL USER TOKENS
export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  for (const [tokenHash, tokenData] of refreshTokenStore.entries()) {
    if (tokenData.user_id === userId) {
      tokenData.revoked = true;

      refreshTokenStore.set(tokenHash, tokenData);
    }
  }
};

// GET USER ACTIVE SESSIONS
export const getUserActiveSessions = async (
  userId: string
): Promise<
  Array<{
    token_hash: string;

    created_at: number;

    expires_at: number;
  }>
> => {
  const sessions: Array<{
    token_hash: string;

    created_at: number;

    expires_at: number;
  }> = [];

  for (const [tokenHash, tokenData] of refreshTokenStore.entries()) {
    if (tokenData.user_id === userId && !tokenData.revoked) {
      sessions.push({
        token_hash: tokenHash,

        created_at: tokenData.created_at,

        expires_at: tokenData.expires_at,
      });
    }
  }

  return sessions;
};

// CLEANUP EXPIRED TOKENS
export const cleanupExpiredTokens = (): void => {
  for (const [tokenHash, tokenData] of refreshTokenStore.entries()) {
    if (tokenData.expires_at < Date.now()) {
      refreshTokenStore.delete(tokenHash);
    }
  }
};
