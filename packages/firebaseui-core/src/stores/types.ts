import { z } from 'zod';
import type { createPhoneFormStore } from './phone-form-store';
import { getTranslation } from '../translations';
import type { TranslationsConfig } from '../translations';

export const LoginTypes = ['email', 'phone', 'anonymous', 'emailLink', 'google'] as const;
export type LoginType = (typeof LoginTypes)[number];
export type AuthMode = 'signIn' | 'signUp';

export function createEmailFormSchema(translations?: TranslationsConfig) {
  return z.object({
    email: z.string().email({ message: getTranslation('errors', 'invalidEmail', translations) }),
    password: z.string().min(8, { message: getTranslation('errors', 'weakPassword', translations) }),
  });
}

export function createForgotPasswordFormSchema(translations?: TranslationsConfig) {
  return z.object({
    email: z.string().email({ message: getTranslation('errors', 'invalidEmail', translations) }),
  });
}

export function createEmailLinkFormSchema(translations?: TranslationsConfig) {
  return z.object({
    email: z.string().email({ message: getTranslation('errors', 'invalidEmail', translations) }),
  });
}

export function createPhoneFormSchema(translations?: TranslationsConfig) {
  return z.object({
    phoneNumber: z
      .string()
      .min(1, { message: getTranslation('errors', 'missingPhoneNumber', translations) })
      .min(10, { message: getTranslation('errors', 'invalidPhoneNumber', translations) }),
    verificationCode: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: getTranslation('errors', 'invalidVerificationCode', translations),
      }),
  });
}

export type EmailFormSchema = z.infer<ReturnType<typeof createEmailFormSchema>>;
export type ForgotPasswordFormSchema = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>;
export type EmailLinkFormSchema = z.infer<ReturnType<typeof createEmailLinkFormSchema>>;
export type PhoneFormSchema = z.infer<ReturnType<typeof createPhoneFormSchema>>;

export type FormStoreType = ReturnType<typeof createPhoneFormStore>;
