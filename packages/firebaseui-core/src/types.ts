import { FirebaseApp } from 'firebase/app';
import { UserCredential, ConfirmationResult } from 'firebase/auth';

export type TranslationStrings = {
  errors?: {
    userNotFound?: string;
    wrongPassword?: string;
    invalidEmail?: string;
    userDisabled?: string;
    networkRequestFailed?: string;
    tooManyRequests?: string;
    emailAlreadyInUse?: string;
    weakPassword?: string;
    operationNotAllowed?: string;
    invalidPhoneNumber?: string;
    missingPhoneNumber?: string;
    quotaExceeded?: string;
    codeExpired?: string;
    captchaCheckFailed?: string;
    missingVerificationId?: string;
    missingEmail?: string;
    invalidActionCode?: string;
    credentialAlreadyInUse?: string;
    requiresRecentLogin?: string;
    providerAlreadyLinked?: string;
    invalidVerificationCode?: string;
    unknownError?: string;
    popupClosed?: string;
  };
  messages?: {
    passwordResetEmailSent?: string;
    signInLinkSent?: string;
    verificationCodeFirst?: string;
    checkEmailForReset?: string;
  };
  labels?: {
    emailAddress?: string;
    password?: string;
    forgotPassword?: string;
    register?: string;
    signIn?: string;
    resetPassword?: string;
    createAccount?: string;
    backToSignIn?: string;
    signInWithPhone?: string;
    phoneNumber?: string;
    verificationCode?: string;
    sendCode?: string;
    verifyCode?: string;
    signInWithGoogle?: string;
    signInWithEmailLink?: string;
    sendSignInLink?: string;
  };
  prompts?: {
    noAccount?: string;
    haveAccount?: string;
    enterEmailToReset?: string;
    signInToAccount?: string;
    enterDetailsToCreate?: string;
    enterPhoneNumber?: string;
    enterVerificationCode?: string;
    enterEmailForLink?: string;
  };
};

export interface FUIConfig {
  app?: FirebaseApp;
  language?: string;
  enableAutoAnonymousLogin?: boolean;
  translations?: Partial<Record<string, Partial<TranslationStrings>>>;
}
