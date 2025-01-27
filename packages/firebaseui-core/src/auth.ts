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
  UserCredential,
  ConfirmationResult,
} from 'firebase/auth';
import { FirebaseUIError } from './errors';
import { type TranslationsConfig } from './translations';

function handleFirebaseError(error: any, translations?: TranslationsConfig): never {
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, translations);
  }
  throw new FirebaseUIError({ code: 'unknown' }, translations);
}

export async function fuiSignInWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return await linkWithCredential(currentUser, credential);
    }

    return await signInWithCredential(auth, credential);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiCreateUserWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return await linkWithCredential(currentUser, credential);
    }

    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiSignInWithPhoneNumber(
  auth: Auth,
  phoneNumber: string,
  recaptchaVerifier: ApplicationVerifier,
  translations?: TranslationsConfig
): Promise<ConfirmationResult> {
  try {
    const currentUser = auth.currentUser;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

    if (currentUser?.isAnonymous) {
      window.localStorage.setItem('anonymousUpgrade', 'true');
    } else {
      window.localStorage.removeItem('anonymousUpgrade');
    }

    return confirmationResult;
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiConfirmPhoneNumber(
  confirmationResult: ConfirmationResult,
  verificationCode: string,
  translations?: TranslationsConfig
): Promise<UserCredential> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('anonymousUpgrade') === 'true';
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, verificationCode);

    if (currentUser?.isAnonymous && isAnonymousUpgrade) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('anonymousUpgrade');
      return result;
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('anonymousUpgrade');
    return result;
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiSendPasswordResetEmail(
  auth: Auth,
  email: string,
  translations?: TranslationsConfig
): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiSendSignInLinkToEmail(
  auth: Auth,
  email: string,
  translations?: TranslationsConfig
): Promise<void> {
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
  } catch (error) {
    handleFirebaseError(error, translations);
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
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('emailLinkAnonymousUpgrade') === 'true';
    const credential = EmailAuthProvider.credentialWithLink(email, link);

    if (currentUser?.isAnonymous && isAnonymousUpgrade) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
      return result;
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    return result;
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiSignInAnonymously(auth: Auth, translations?: TranslationsConfig): Promise<UserCredential> {
  try {
    return await signInAnonymously(auth);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiUpgradeAnonymousUser(
  auth: Auth,
  email: string,
  password: string,
  translations?: TranslationsConfig
): Promise<UserCredential> {
  const currentUser = auth.currentUser;
  if (!currentUser?.isAnonymous) {
    throw new FirebaseUIError({ code: 'auth/not-anonymous' }, translations);
  }
  try {
    const credential = EmailAuthProvider.credential(email, password);
    return await linkWithCredential(currentUser, credential);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}

export async function fuiSignInWithOAuth(
  auth: Auth,
  translations?: TranslationsConfig,
  provider?: OAuthProvider | GoogleAuthProvider
): Promise<void> {
  const oAuthProvider = provider || new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, oAuthProvider);
  } catch (error) {
    handleFirebaseError(error, translations);
  }
}
