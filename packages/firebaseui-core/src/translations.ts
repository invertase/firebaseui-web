import type { TranslationStrings } from './types';

export type ErrorKey = keyof Required<TranslationStrings>['errors'];
export type MessageKey = keyof Required<TranslationStrings>['messages'];
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

type TranslationCategory = keyof Required<TranslationStrings>;
type TranslationKey<T extends TranslationCategory> = keyof Required<TranslationStrings>[T];
type TranslationSet<T extends TranslationCategory> = Record<TranslationKey<T>, string>;

export function getTranslation<T extends TranslationCategory>(
  category: T,
  key: TranslationKey<T>,
  translations?: TranslationsConfig,
  language = 'en'
): string {
  const userPreferredTranslationSet = translations?.[language]?.[category] as TranslationSet<T>;

  // Try user's preferred language first
  if (userPreferredTranslationSet && key in userPreferredTranslationSet) {
    return userPreferredTranslationSet[key];
  }

  // Fall back to English translations if provided
  const fallbackTranslationSet = translations?.['en']?.[category] as TranslationSet<T>;
  if (fallbackTranslationSet && key in fallbackTranslationSet) {
    return fallbackTranslationSet[key];
  }

  // Default to built-in English translations
  const defaultTranslationSet = defaultTranslations.en[category] as TranslationSet<T>;
  return defaultTranslationSet[key];
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
      popupClosed: 'The sign-in popup was closed. Please try again.',
    },
    messages: {
      passwordResetEmailSent: 'Password reset email sent successfully',
      signInLinkSent: 'Sign-in link sent successfully',
      verificationCodeFirst: 'Please request a verification code first',
      checkEmailForReset: 'Check your email for password reset instructions',
    },
    labels: {
      emailAddress: 'Email Address',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      register: 'Register',
      signIn: 'Sign In',
      resetPassword: 'Reset Password',
      createAccount: 'Create Account',
      backToSignIn: 'Back to Sign In',
      signInWithPhone: 'Sign in with Phone',
      phoneNumber: 'Phone Number',
      verificationCode: 'Verification Code',
      sendCode: 'Send Code',
      verifyCode: 'Verify Code',
      signInWithGoogle: 'Sign in with Google',
      signInWithEmailLink: 'Sign in with Email Link',
      sendSignInLink: 'Send Sign-in Link',
    },
    prompts: {
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      enterEmailToReset: 'Enter your email address to reset your password',
      signInToAccount: 'Sign in to your account',
      enterDetailsToCreate: 'Enter your details to create a new account',
      enterPhoneNumber: 'Enter your phone number',
      enterVerificationCode: 'Enter the verification code',
      enterEmailForLink: 'Enter your email to receive a sign-in link',
    },
  },
};
