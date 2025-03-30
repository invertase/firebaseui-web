import {
  createUserWithEmailAndPassword as _createUserWithEmailAndPassword,
  isSignInWithEmailLink as _isSignInWithEmailLink,
  sendPasswordResetEmail as _sendPasswordResetEmail,
  sendSignInLinkToEmail as _sendSignInLinkToEmail,
  signInAnonymously as _signInAnonymously,
  signInWithPhoneNumber as _signInWithPhoneNumber,
  ActionCodeSettings,
  AuthProvider,
  ConfirmationResult,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithRedirect,
  UserCredential,
} from 'firebase/auth';
import { getBehavior, hasBehavior } from './behaviors';
import { FirebaseUI } from './config';
import { handleFirebaseError } from './errors';

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
    handleFirebaseError(ui, error);
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
    handleFirebaseError(ui, error);
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
    handleFirebaseError(ui, error);
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
    handleFirebaseError(ui, error);
  }
}

export async function sendPasswordResetEmail(ui: FirebaseUI, email: string): Promise<void> {
  try {
    const auth = getAuth(ui.get().app);
    await _sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleFirebaseError(ui, error);
  }
}

export async function sendSignInLinkToEmail(ui: FirebaseUI, email: string): Promise<void> {
  try {
    const auth = getAuth(ui.get().app);

    const actionCodeSettings = {
      url: window.location.href,
      // TODO(ehesp): Check this...
      handleCodeInApp: true,
    } satisfies ActionCodeSettings;

    await _sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  } catch (error) {
    handleFirebaseError(ui, error);
  }
}

export async function fuiSignInWithEmailLink(ui: FirebaseUI, email: string, link: string): Promise<UserCredential> {
  try {
    const auth = ui.get().getAuth();
    const credential = EmailAuthProvider.credentialWithLink(email, link);

    if (hasBehavior(ui, 'autoUpgradeAnonymousCredential')) {
      const result = await getBehavior(ui, 'autoUpgradeAnonymousCredential')(auth, credential);
      if (result) {
        return handlePendingCredential(result);
      }
    }

    const result = await signInWithCredential(auth, credential);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(ui, error);
  }
}

export async function signInAnonymously(ui: FirebaseUI): Promise<UserCredential> {
  try {
    const auth = getAuth(ui.get().app);
    const result = await _signInAnonymously(auth);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(ui, error);
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
    handleFirebaseError(ui, error);
  }
}

export async function fuiCompleteEmailLinkSignIn(ui: FirebaseUI, currentUrl: string): Promise<UserCredential | null> {
  try {
    const auth = ui.get().getAuth();
    if (!_isSignInWithEmailLink(auth, currentUrl)) {
      return null;
    }

    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) return null;

    const result = await fuiSignInWithEmailLink(ui, email, currentUrl);
    return handlePendingCredential(result);
  } catch (error) {
    handleFirebaseError(ui, error);
  } finally {
    window.localStorage.removeItem('emailForSignIn');
  }
}
