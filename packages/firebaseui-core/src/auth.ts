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
  signInWithRedirect,
  Auth,
  UserCredential,
  ConfirmationResult,
  RecaptchaVerifier,
  AuthProvider,
} from 'firebase/auth';
import { FirebaseUIError } from './errors';
import { type TranslationsConfig } from './translations';

async function handleFirebaseError(
  error: any,
  opts?: { language?: string; translations?: TranslationsConfig; enableHandleExistingCredential?: boolean }
): Promise<never | UserCredential> {
  if (error?.code === 'auth/account-exists-with-different-credential' && opts?.enableHandleExistingCredential) {
    if (error.credential) {
      window.sessionStorage.setItem('pendingCred', JSON.stringify(error.credential));
    }

    throw new FirebaseUIError(
      {
        code: 'auth/account-exists-with-different-credential',
        customData: {
          email: error.customData?.email,
        },
      },
      opts?.translations,
      opts?.language
    );
  }

  // TODO: Debug why instanceof FirebaseError is not working
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, opts?.translations, opts?.language);
  }
  throw new FirebaseUIError({ code: 'unknown' }, opts?.translations, opts?.language);
}

async function handlePendingCredential(user: UserCredential): Promise<UserCredential> {
  const pendingCredString = window.sessionStorage.getItem('pendingCred');
  if (!pendingCredString) return user;

  try {
    const pendingCred = JSON.parse(pendingCredString);
    const result = await linkWithCredential(user.user, pendingCred);
    window.sessionStorage.removeItem('pendingCred');
    return result;
  } catch (error) {
    window.sessionStorage.removeItem('pendingCred');
    return user;
  }
}

export async function fuiSignInWithEmailAndPassword(
  auth: Auth,
  email: string,
  password: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
    enableHandleExistingCredential?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      return handlePendingCredential(result);
    }

    const result = await signInWithCredential(auth, credential);
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
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
    enableHandleExistingCredential?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      return handlePendingCredential(result);
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
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
    return (await handleFirebaseError(error, opts)) as never;
  }
}

export async function fuiConfirmPhoneNumber(
  confirmationResult: ConfirmationResult,
  verificationCode: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
    enableHandleExistingCredential?: boolean;
  }
): Promise<UserCredential> {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, verificationCode);

    if (currentUser?.isAnonymous && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      return handlePendingCredential(result);
    }

    const result = await signInWithCredential(auth, credential);
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
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
    return (await handleFirebaseError(error, opts)) as never;
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
    return (await handleFirebaseError(error, opts)) as never;
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
    enableHandleExistingCredential?: boolean;
  }
): Promise<UserCredential> {
  try {
    const currentUser = auth.currentUser;
    const isAnonymousUpgrade = window.localStorage.getItem('emailLinkAnonymousUpgrade') === 'true';
    const credential = EmailAuthProvider.credentialWithLink(email, link);

    if (currentUser?.isAnonymous && isAnonymousUpgrade && opts?.enableAutoUpgradeAnonymous) {
      const result = await linkWithCredential(currentUser, credential);
      window.localStorage.removeItem('emailLinkAnonymousUpgrade');
      return handlePendingCredential(result);
    }

    const result = await signInWithCredential(auth, credential);
    window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
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
    const result = await signInAnonymously(auth);
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
  }
}

export async function fuiSignInWithOAuth(
  auth: Auth,
  provider: AuthProvider,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
    enableHandleExistingCredential?: boolean;
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
    return (await handleFirebaseError(error, opts)) as never;
  }
}

export async function fuiCompleteEmailLinkSignIn(
  auth: Auth,
  currentUrl: string,
  opts?: {
    language?: string;
    translations?: TranslationsConfig;
    enableAutoUpgradeAnonymous?: boolean;
    enableHandleExistingCredential?: boolean;
  }
): Promise<UserCredential | null> {
  try {
    if (!fuiIsSignInWithEmailLink(auth, currentUrl)) {
      return null;
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) return null;

    const result = await fuiSignInWithEmailLink(auth, email, currentUrl, opts);
    window.localStorage.removeItem('emailForSignIn');
    return handlePendingCredential(result);
  } catch (error) {
    return await handleFirebaseError(error, opts);
  }
}
