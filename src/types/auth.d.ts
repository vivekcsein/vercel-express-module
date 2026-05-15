/* -------------------------------------------------------------------------- */
/*                               BASE ENTITIES                                */
/* -------------------------------------------------------------------------- */

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/* -------------------------------------------------------------------------- */
/*                                   USER                                     */
/* -------------------------------------------------------------------------- */

export interface User extends BaseEntity {
  email: string;
  fullname: string;
  avatar_url?: string | null;
  is_verified?: boolean;
  role?: UserRole;
}

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export type UserRole = "USER" | "ADMIN" | "MODERATOR";

/* -------------------------------------------------------------------------- */
/*                              AUTH CREDENTIALS                              */
/* -------------------------------------------------------------------------- */

export interface SigninCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends SigninCredentials {
  fullname: string;
}

/* -------------------------------------------------------------------------- */
/*                                  TOKENS                                    */
/* -------------------------------------------------------------------------- */

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/* -------------------------------------------------------------------------- */
/*                                  SESSION                                   */
/* -------------------------------------------------------------------------- */

export interface Session {
  user: User;
  expires_in: number;
}

/* -------------------------------------------------------------------------- */
/*                            REQUEST BODY TYPES                              */
/* -------------------------------------------------------------------------- */

export interface SignupRequestBody {
  email: string;
  password: string;
  fullname: string;
}

export interface SigninRequestBody {
  email: string;
  password: string;
}

export interface RefreshSessionRequestBody {
  refresh_token?: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface ResetPasswordRequestBody {
  token: string;
  password: string;
}

/* -------------------------------------------------------------------------- */
/*                              SUCCESS RESPONSE                              */
/* -------------------------------------------------------------------------- */

export interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

/* -------------------------------------------------------------------------- */
/*                               ERROR RESPONSE                               */
/* -------------------------------------------------------------------------- */

export interface ErrorResponse {
  success: false;
  message: string;
  field?: string;
  issues?: unknown;
}

/* -------------------------------------------------------------------------- */
/*                             GENERIC API RESPONSE                           */
/* -------------------------------------------------------------------------- */

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/* -------------------------------------------------------------------------- */
/*                             AUTH API RESPONSES                             */
/* -------------------------------------------------------------------------- */

export interface AuthResponseData {
  user: User;
  session: Session;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

/* -------------------------------------------------------------------------- */
/*                               REQUEST USER                                 */
/* -------------------------------------------------------------------------- */

export interface RequestUser {
  id: string;
  email: string;
  fullname: string;
  role?: UserRole;
}

/* -------------------------------------------------------------------------- */
/*                          AUTHENTICATED REQUEST                             */
/* -------------------------------------------------------------------------- */

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
