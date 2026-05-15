import { z } from "zod";
import {
  emailRules,
  passwordRules,
  fullnameRules,
  termsAcceptedRules,
} from "../configs/config.schema";

/* -------------------------------------------------------------------------- */
/*                               SCHEMA                                       */
/* -------------------------------------------------------------------------- */

export const signupSchema = z
  .object({
    fullname: fullnameRules.optional(),
    email: emailRules,
    password: passwordRules,
    confirmPassword: passwordRules,
    terms: termsAcceptedRules.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password do not match",
    path: ["confirmPassword"],
  })
  .describe("Registration form");

export const signinSchema = z.object({
  email: emailRules,
  password: passwordRules,
  remember: z.boolean().optional(),
});

export const forgetPasswordSchema = z.object({
  email: emailRules,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordRules,
  confirmPassword: passwordRules,
});

export const updatePasswordSchema = z.object({
  password: passwordRules,
  confirmPassword: passwordRules,
});

export const updateProfileSchema = z.object({
  fullname: fullnameRules,
  email: emailRules,
});

export const contactSchema = z.object({
  fullname: fullnameRules,
  email: emailRules,
  topic: z.string().trim().min(5, "Topic is required"),
  message: z.string().trim().min(5, "Message is required"),
  newsletter: z.boolean().optional(),
});

/* -------------------------------------------------------------------------- */
/*                               SCHEMA OUTPUT                                */
/* -------------------------------------------------------------------------- */

export type SignupSchemaInput = z.infer<typeof signupSchema>;

export type SignupSchemaOutput = z.output<typeof signupSchema>;
