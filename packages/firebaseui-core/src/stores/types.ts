import { z } from 'zod';
import type { UserCredential, ConfirmationResult } from 'firebase/auth';
import type { EmailFormStore } from './email-form-store';
import type { PhoneFormStore } from './phone-form-store';
import type { EmailLinkFormStore } from './email-link-form-store';

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

export type EmailFormState = z.infer<typeof emailFormSchema>;
export type PhoneFormState = z.infer<typeof phoneFormSchema>;
export type EmailLinkFormState = z.infer<typeof emailLinkFormSchema>;

export type LoginResult = {
  success: boolean;
  data?: UserCredential | ConfirmationResult;
  error?: z.ZodError | { code: string; message: string };
  message?: string;
};

export interface BaseFormState {
  isLoading: boolean;
  error: string | null;
}

export type FormStoreType = EmailFormStore | PhoneFormStore | EmailLinkFormStore;
