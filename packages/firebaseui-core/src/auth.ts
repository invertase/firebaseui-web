import {
  getAuth,
  signInWithCredential,
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  signInWithPhoneNumber as _signInWithPhoneNumber,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  sendSignInLinkToEmail as _sendSignInLinkToEmail,
  signInAnonymously as _signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  signInWithRedirect,
  Auth,
  UserCredential,
  ConfirmationResult,
  RecaptchaVerifier,
  AuthProvider,
  isSignInWithEmailLink as _isSignInWithEmailLink,
  ActionCodeSettings,
} from 'firebase/auth';
import { handleFirebaseError } from './errors';
import { getBehavior, hasBehavior } from './behaviors';
import { FirebaseUI } from './config';

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

export async function signInWithEmailAndPassword(
  ui: FirebaseUI,
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const auth = getAuth(ui.get().app);
    const credential = EmailAuthProvider.credential(email, password);

    if (hasBehavior(ui, 'autoUpgradeAnonymousCredential')) {
      const result = await getBehavior(ui, 'autoUpgradeAnonymousCredential')(auth, credential);

      if (result) {
        return handlePendingCredential(result);
      }
    }

    const result = await signInWithCredential(auth, credential);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function createUserWithEmailAndPassword(
  ui: FirebaseUI,
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    const auth = getAuth(ui.get().app);
    const credential = EmailAuthProvider.credential(email, password);

    if (hasBehavior(ui, 'autoUpgradeAnonymousCredential')) {
      const result = await getBehavior(ui, 'autoUpgradeAnonymousCredential')(auth, credential);

      if (result) {
        return handlePendingCredential(result);
      }
    }

    const result = await _createUserWithEmailAndPassword(auth, email, password);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function signInWithPhoneNumber(
  ui: FirebaseUI,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  try {
    const auth = getAuth(ui.get().app);
    return await _signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function confirmPhoneNumber(
  ui: FirebaseUI,
  confirmationResult: ConfirmationResult,
  verificationCode: string
): Promise<UserCredential> {
  try {
    const auth = getAuth(ui.get().app);
    const currentUser = auth.currentUser;
    const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, verificationCode);

    if (currentUser?.isAnonymous && hasBehavior(ui, 'autoUpgradeAnonymousCredential')) {
      const result = await getBehavior(ui, 'autoUpgradeAnonymousCredential')(auth, credential);

      if (result) {
        return handlePendingCredential(result);
      }
    }

    const result = await signInWithCredential(auth, credential);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function sendPasswordResetEmail(ui: FirebaseUI, email: string): Promise<void> {
  try {
    const auth = getAuth(ui.get().app);
    await _sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function sendSignInLinkToEmail(
  ui: FirebaseUI,
  email: string,
): Promise<void> {
  try {
    const auth = getAuth(ui.get().app);

    const actionCodeSettings = {
      url: window.location.href,
      // TODO(ehesp): Check this...
      handleCodeInApp: true,
    } satisfies ActionCodeSettings;

    // TODO(ehesp): Is this needed here? Its only applicable when 
    // actually signing them in, not sending the link.
    // if (hasBehavior(ui, 'autoUpgradeAnonymousLink')) {
    //   window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
    // } else {
    //   window.localStorage.removeItem('emailLinkAnonymousUpgrade');
    // }

    await _sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    return (await handleFirebaseError(error, opts)) as never;
  }
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
    return handleFirebaseError(error, opts);
  }
}

export async function signInAnonymously(ui: FirebaseUI): Promise<UserCredential> {
  try {
    const auth = getAuth(ui.get().app);
    const result = await _signInAnonymously(auth);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(error, ui);
  }
}

export async function signInWithOAuth(ui: FirebaseUI, provider: AuthProvider): Promise<void> {
  try {
    const auth = getAuth(ui.get().app);

    if (hasBehavior(ui, 'autoUpgradeAnonymousProvider')) {
      await getBehavior(ui, 'autoUpgradeAnonymousProvider')(auth, provider);
      // If we get to here, the user is not anonymous, otherwise they
      // have been redirected to the provider's sign in page.
    }

    await signInWithRedirect(auth, provider);
  } catch (error) {
    handleFirebaseError(error, ui);
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
    if (!_isSignInWithEmailLink(auth, currentUrl)) {
      return null;
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) return null;

    const result = await fuiSignInWithEmailLink(auth, email, currentUrl, opts);
    return handlePendingCredential(result);
  } catch (error) {
    return handleFirebaseError(error, opts);
  } finally {
    window.localStorage.removeItem('emailForSignIn');
    window.localStorage.removeItem('emailLinkAnonymousUpgrade');
  }
}
