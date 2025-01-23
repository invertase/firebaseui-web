import type { TranslationStrings } from './types';

export type ErrorKey = keyof TranslationStrings['errors'];
export type MessageKey = keyof TranslationStrings['messages'];
export type TranslationsConfig = Partial<Record<string, Partial<TranslationStrings>>>;

export const ERROR_CODE_MAP: Record<string, ErrorKey> = {
  'auth/user-not-found': 'userNotFound',
  'auth/wrong-password': 'wrongPassword',
  'auth/invalid-email': 'invalidEmail',
  'auth/user-disabled': 'userDisabled',
  'auth/network-request-failed': 'networkRequestFailed',
  'auth/too-many-requests': 'tooManyRequests',
  'auth/email-already-in-use': 'emailAlreadyInUse',
  'auth/weak-password': 'weakPassword',
  'auth/operation-not-allowed': 'operationNotAllowed',
  'auth/invalid-phone-number': 'invalidPhoneNumber',
  'auth/missing-phone-number': 'missingPhoneNumber',
  'auth/quota-exceeded': 'quotaExceeded',
  'auth/code-expired': 'codeExpired',
  'auth/captcha-check-failed': 'captchaCheckFailed',
  'auth/missing-verification-id': 'missingVerificationId',
  'auth/missing-email': 'missingEmail',
  'auth/invalid-action-code': 'invalidActionCode',
  'auth/credential-already-in-use': 'credentialAlreadyInUse',
  'auth/requires-recent-login': 'requiresRecentLogin',
  'auth/provider-already-linked': 'providerAlreadyLinked',
  'auth/invalid-verification-code': 'invalidVerificationCode',
};

export function getTranslation<T extends keyof TranslationStrings>(
  category: T,
  key: keyof TranslationStrings[T],
  translations?: TranslationsConfig,
  language = 'en'
): string {
  const translationSet =
    translations?.[language]?.[category] ?? translations?.['en']?.[category] ?? defaultTranslations.en[category];

  return (translationSet as Record<keyof TranslationStrings[T], string>)[key];
}

export const defaultTranslations: Record<'en', TranslationStrings> = {
  en: {
    errors: {
      userNotFound: 'No account found with this email address',
      wrongPassword: 'Incorrect password',
      invalidEmail: 'Please enter a valid email address',
      userDisabled: 'This account has been disabled',
      networkRequestFailed: 'Unable to connect to the server. Please check your internet connection',
      tooManyRequests: 'Too many failed attempts. Please try again later',
      emailAlreadyInUse: 'An account already exists with this email',
      weakPassword: 'Password should be at least 6 characters',
      operationNotAllowed: 'Email/password accounts are not enabled. Please contact support.',
      invalidPhoneNumber: 'The phone number is invalid',
      missingPhoneNumber: 'Please provide a phone number',
      quotaExceeded: 'SMS quota exceeded. Please try again later',
      codeExpired: 'The verification code has expired',
      captchaCheckFailed: 'reCAPTCHA verification failed. Please try again.',
      missingVerificationId: 'Please complete the reCAPTCHA verification first.',
      missingEmail: 'Please provide an email address',
      invalidActionCode: 'The password reset link is invalid or has expired',
      credentialAlreadyInUse: 'An account already exists with this email. Please sign in with that account.',
      requiresRecentLogin: 'This operation requires a recent login. Please sign in again.',
      providerAlreadyLinked: 'This phone number is already linked to another account',
      invalidVerificationCode: 'Invalid verification code. Please try again',
      unknownError: 'An unexpected error occurred',
    },
    messages: {
      passwordResetEmailSent: 'Password reset email sent successfully',
      signInLinkSent: 'Sign-in link sent successfully',
      verificationCodeFirst: 'Please request a verification code first',
    },
  },
};
