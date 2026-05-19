import type { Response, CookieOptions } from "express";
import { envAuthConfig } from "../../../../packages/env/env.auth";

import {
  ACCESS_TOKEN_CONFIG,
  REFRESH_TOKEN_CONFIG,
} from "../../../../packages/utils/utils.constant";

import {
  setCookie,
  clearCookie,
  getCookieExpiryInDays,
} from "../../../../packages/utils/utils.cookies";

// ACCESS TOKEN OPTIONS
const accessTokenCookieOptions: CookieOptions = {
  maxAge: getCookieExpiryInDays(envAuthConfig.ACCESS_TOKEN_EXPIRES_IN), // 1 day
};

//  REFRESH TOKEN OPTIONS
const refreshTokenCookieOptions: CookieOptions = {
  maxAge: getCookieExpiryInDays(envAuthConfig.REFRESH_TOKEN_EXPIRES_IN), // 30 days
};

//  SET AUTH COOKIES
interface SetAuthCookiesParams {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookies = ({ res, accessToken, refreshToken }: SetAuthCookiesParams): void => {
  setCookie({
    res,
    name: ACCESS_TOKEN_CONFIG.ACCESS_TOKEN_COOKIE,
    value: accessToken,
    options: accessTokenCookieOptions,
  });

  setCookie({
    res,
    name: REFRESH_TOKEN_CONFIG.REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    options: refreshTokenCookieOptions,
  });
};

// CLEAR AUTH COOKIES
export const clearAuthCookies = (res: Response): void => {
  clearCookie({
    res,
    name: ACCESS_TOKEN_CONFIG.ACCESS_TOKEN_COOKIE,
    options: accessTokenCookieOptions,
  });

  clearCookie({
    res,
    name: REFRESH_TOKEN_CONFIG.REFRESH_TOKEN_COOKIE,
    options: refreshTokenCookieOptions,
  });
};
