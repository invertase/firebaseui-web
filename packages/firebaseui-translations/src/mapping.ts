import { Locale } from ".";
import type {
  Translations,
  TranslationCategory,
  TranslationKey,
  TranslationSet,
  ErrorKey,
} from "./types";

export const ERROR_CODE_MAP = {
  "auth/user-not-found": "userNotFound",
  "auth/wrong-password": "wrongPassword",
  "auth/invalid-email": "invalidEmail",
  "auth/user-disabled": "userDisabled",
  "auth/network-request-failed": "networkRequestFailed",
  "auth/too-many-requests": "tooManyRequests",
  "auth/email-already-in-use": "emailAlreadyInUse",
  "auth/weak-password": "weakPassword",
  "auth/operation-not-allowed": "operationNotAllowed",
  "auth/invalid-phone-number": "invalidPhoneNumber",
  "auth/missing-phone-number": "missingPhoneNumber",
  "auth/quota-exceeded": "quotaExceeded",
  "auth/code-expired": "codeExpired",
  "auth/captcha-check-failed": "captchaCheckFailed",
  "auth/missing-verification-id": "missingVerificationId",
  "auth/missing-email": "missingEmail",
  "auth/invalid-action-code": "invalidActionCode",
  "auth/credential-already-in-use": "credentialAlreadyInUse",
  "auth/requires-recent-login": "requiresRecentLogin",
  "auth/provider-already-linked": "providerAlreadyLinked",
  "auth/invalid-verification-code": "invalidVerificationCode",
  "auth/account-exists-with-different-credential":
    "accountExistsWithDifferentCredential",
} satisfies Record<string, ErrorKey>;

// export function getTranslation<T extends TranslationCategory>(
//   category: T,
//   key: TranslationKey<T>,
//   translations: Translations,
//   locale: Locale
// ): string {
//   const userPreferredTranslationSet = translations?.[language]?.[
//     category
//   ] as TranslationSet<T>;

//   // Try user's preferred language first
//   if (userPreferredTranslationSet && key in userPreferredTranslationSet) {
//     return userPreferredTranslationSet[key];
//   }

//   // Fall back to English translations if provided
//   const fallbackTranslationSet = translations?.["en"]?.[
//     category
//   ] as TranslationSet<T>;
//   if (fallbackTranslationSet && key in fallbackTranslationSet) {
//     return fallbackTranslationSet[key];
//   }

//   // Default to built-in English translations
//   const defaultTranslationSet = defaultTranslations.en[
//     category
//   ] as TranslationSet<T>;
//   return defaultTranslationSet[key];
// }
