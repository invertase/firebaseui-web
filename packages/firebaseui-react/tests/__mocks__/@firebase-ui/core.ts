/**
 * This is the automatic module mock for @firebase-ui/core
 * It re-exports the mock implementations from utils/mocks.ts to avoid duplication
 */
import {
  FirebaseUIError,
  TranslationStrings,
  mockCountryData,
  createCoreMocks,
} from "../../utils/mocks";

// Create a plain object with all the mocks
const coreMocks = createCoreMocks();

// Export types
export type { TranslationStrings };

// Export the error class
export { FirebaseUIError };

// Export other values
export const countryData = mockCountryData;

// Export mock functions directly from coreMocks
export const fuiSignInWithEmailAndPassword =
  coreMocks.fuiSignInWithEmailAndPassword;
export const fuiSignInWithEmailLink = coreMocks.fuiSignInWithEmailLink;
export const fuiSendSignInLinkToEmail = coreMocks.fuiSendSignInLinkToEmail;
export const fuiCompleteEmailLinkSignIn = coreMocks.fuiCompleteEmailLinkSignIn;
export const fuiSignInWithPhone = coreMocks.fuiSignInWithPhone;
export const fuiSignInWithOAuth = coreMocks.fuiSignInWithOAuth;
export const fuiResetPassword = coreMocks.fuiResetPassword;
export const fuiSendPasswordResetEmail = coreMocks.fuiSendPasswordResetEmail;
export const fuiCreateUserWithEmailAndPassword =
  coreMocks.fuiCreateUserWithEmailAndPassword;
export const getTranslation = coreMocks.getTranslation;
