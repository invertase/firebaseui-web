import {
  getAuth,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  ApplicationVerifier,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
  Auth,
} from 'firebase/auth';
import type { AuthResult } from './types';
import { ERROR_CODE_MAP, getTranslation, type TranslationsConfig } from './translations';

function handleFirebaseError(error: any, translations?: TranslationsConfig): AuthResult {
  if (error?.name === 'FirebaseError') {
    const errorCode = (error.customData?.message?.match(/\(([^)]+)\)/) || [])[1] || error.code;
    const translationKey = ERROR_CODE_MAP[errorCode] || 'unknownError';
    return {
      success: false,
      error: {
        code: errorCode,
        message: getTranslation('errors', translationKey, translations),
      },
    };
  }
  return {
    success: false,
    error: {
      code: 'unknown',
      message: getTranslation('errors', 'unknownError', translations),
    },
  };
}

export async function fuiSignInWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return { success: true, data: await linkWithCredential(currentUser, credential) };
    }

    return { success: true, data: await signInWithCredential(auth, credential) };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiCreateUserWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return { success: true, data: await linkWithCredential(currentUser, credential) };
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiSignInWithPhoneNumber(
  auth: Auth,
  phoneNumber: string,
  recaptchaVerifier: ApplicationVerifier,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const currentUser = auth.currentUser;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

    if (currentUser?.isAnonymous) {
      window.localStorage.setItem('anonymousUpgrade', 'true');
    } else {
      window.localStorage.removeItem('anonymousUpgrade');
    }

    return { success: true, data: confirmationResult };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiConfirmPhoneNumber(
  confirmationResult: any,
  verificationCode: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('anonymousUpgrade') === 'true';
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, verificationCode);

    if (currentUser?.isAnonymous && isAnonymousUpgrade) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('anonymousUpgrade');
      return { success: true, data: result };
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('anonymousUpgrade');
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiSendPasswordResetEmail(
  auth: Auth,
  email: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      data: undefined,
      message: getTranslation('messages', 'passwordResetEmailSent', translations),
    };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiSendSignInLinkToEmail(
  auth: Auth,
  email: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const currentUser = auth.currentUser;
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    if (currentUser?.isAnonymous) {
      window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
    } else {
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    return {
      success: true,
      message: getTranslation('messages', 'signInLinkSent', translations),
    };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export function fuiIsSignInWithEmailLink(auth: Auth, link: string): boolean {
  return isSignInWithEmailLink(auth, link);
}

export async function fuiSignInWithEmailLink(
  auth: Auth,
  email: string,
  link: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  try {
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('emailLinkAnonymousUpgrade') === 'true';
    const credential = EmailAuthProvider.credentialWithLink(email, link);

    if (currentUser?.isAnonymous && isAnonymousUpgrade) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
      return { success: true, data: result };
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiSignInAnonymously(auth: Auth, translations?: TranslationsConfig): Promise<AuthResult> {
  try {
    const result = await signInAnonymously(auth);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiUpgradeAnonymousUser(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<AuthResult> {
  const currentUser = auth.currentUser;
  if (!currentUser?.isAnonymous) {
    return {
      success: false,
      error: {
        code: 'auth/not-anonymous',
        message: getTranslation('errors', 'unknownError', translations),
      },
    };
  }
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(currentUser, credential);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}

export async function fuiSignInWithOAuth(
  auth: Auth,
  translations?: TranslationsConfig,
  provider?: OAuthProvider | GoogleAuthProvider
): Promise<AuthResult> {
  const oAuthProvider = provider || new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, oAuthProvider);
    return { success: true };
  } catch (error) {
    return handleFirebaseError(error, translations);
  }
}
