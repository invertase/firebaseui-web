import {
  getAuth,
  signInWithCredential,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInAnonymously,
  linkWithCredential,
  linkWithRedirect,
  EmailAuthProvider,
  PhoneAuthProvider,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
  Auth,
  UserCredential,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth';
import { FirebaseUIError } from './errors';
import { type TranslationsConfig } from './translations';

function handleFirebaseError(error: any, translations?: TranslationsConfig, language?: string): never {
  // TODO: Debug why instanceof FirebaseError is not working
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, translations, language);
  }
  throw new FirebaseUIError({ code: 'unknown' }, translations, language);
}

export async function fuiSignInWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      return await linkWithCredential(currentUser, credential);
    }

    return await signInWithCredential(auth, credential);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiCreateUserWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      return await linkWithCredential(currentUser, credential);
    }

    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiSignInWithPhoneNumber(
  auth: Auth,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
  }
): Promise<ConfirmationResult> {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiConfirmPhoneNumber(
  confirmationResult: ConfirmationResult,
  verificationCode: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<UserCredential> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, verificationCode);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      return result;
    }

    return await signInWithCredential(auth, credential);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiSendPasswordResetEmail(
  auth: Auth,
  email: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
  }
): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiSendSignInLinkToEmail(
  auth: Auth,
  email: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };
    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
    } else {
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    }
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export function fuiIsSignInWithEmailLink(auth: Auth, link: string): boolean {
  return isSignInWithEmailLink(auth, link);
}

export async function fuiSignInWithEmailLink(
  auth: Auth,
  email: string,
  link: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('emailLinkAnonymousUpgrade') === 'true';
    const credential = EmailAuthProvider.credentialWithLink(email, link);

    if (currentUser?.isAnonymous && isAnonymousUpgrade && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
      return result;
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    return result;
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiSignInAnonymously(
  auth: Auth,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
  }
): Promise<UserCredential> {
  try {
    return await signInAnonymously(auth);
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}

export async function fuiSignInWithOAuth(
  auth: Auth,
  provider: OAuthProvider | GoogleAuthProvider,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
  }
): Promise<void> {
  try {
    const currentUser = auth.currentUser;

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      await linkWithRedirect(currentUser, provider);
    } else {
      await signInWithRedirect(auth, provider);
    }
  } catch (error) {
    handleFirebaseError(error, opts?.translations, opts?.language);
  }
}
