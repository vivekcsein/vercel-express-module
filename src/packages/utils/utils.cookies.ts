import { envAuthConfig } from "../env/env.auth";
import type { Response, CookieOptions } from "express";

export const baseCookieOptions: CookieOptions = {
  httpOnly: envAuthConfig.COOKIE_HTTP_ONLY,
  secure: envAuthConfig.COOKIE_SECURE,
  sameSite: envAuthConfig.COOKIE_SAME_SITE,
  path: "/",
};

// SET COOKIE
interface SetCookieParams {
  res: Response;
  name: string;
  value: string;
  options?: CookieOptions;
}

export const setCookie = ({ res, name, value, options = {} }: SetCookieParams): void => {
  res.cookie(name, value, {
    ...baseCookieOptions,
    ...options,
  });
};

// CLEAR COOKIE
interface ClearCookieParams {
  res: Response;
  name: string;
  options?: CookieOptions;
}

export const clearCookie = ({ res, name, options = {} }: ClearCookieParams): void => {
  res.clearCookie(name, {
    ...baseCookieOptions,
    ...options,
  });
};

/**
 * Returns cookie expiration time in milliseconds for given number of days.
 */
export const getCookieExpiryInDays = (days: number): number => {
  return days * 24 * 60 * 60 * 1000; //express cookie plugin expect it in seconds
};

/**
 * Returns cookie expiration time in milliseconds for given number of minutes.
 */
export const getCookieExpiryInMinutes = (minutes: number): number => {
  return minutes * 60 * 1000;
};
