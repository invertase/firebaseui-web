import { z } from 'zod';
import type { createEmailFormStore } from './email-form-store';
import type { createPhoneFormStore } from './phone-form-store';
import type { createEmailLinkFormStore } from './email-link-form-store';

export const LoginTypes = ['email', 'phone', 'anonymous', 'emailLink', 'google'] as const;
export type LoginType = (typeof LoginTypes)[number];
export type AuthMode = 'signIn' | 'signUp';

export const emailFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  authMode: z.enum(['signIn', 'signUp']),
});

export const emailLinkFormSchema = z.object({
  email: z.string().email(),
});

export const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10),
  verificationCode: z.string().optional(),
});

export type EmailFormSchema = z.input<typeof emailFormSchema>;
export type PhoneFormSchema = z.infer<typeof phoneFormSchema>;
export type EmailLinkFormSchema = z.infer<typeof emailLinkFormSchema>;

export type FormStoreType =
  | ReturnType<typeof createEmailFormStore>
  | ReturnType<typeof createPhoneFormStore>
  | ReturnType<typeof createEmailLinkFormStore>;
