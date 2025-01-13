import {
  getAuth,
  signInWithCredential,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithPhoneNumber,
  ConfirmationResult,
  ApplicationVerifier,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
} from 'firebase/auth';
import { FUIConfig } from '../config';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address',
  'auth/wrong-password': 'Incorrect password',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/user-disabled': 'This account has been disabled',
  'auth/network-request-failed': 'Unable to connect to the server. Please check your internet connection',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later',
  'auth/email-already-in-use': 'An account already exists with this email',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
  'auth/invalid-phone-number': 'The phone number is invalid',
  'auth/missing-phone-number': 'Please provide a phone number',
  'auth/quota-exceeded': 'SMS quota exceeded. Please try again later',
  'auth/code-expired': 'The verification code has expired',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/missing-verification-id': 'Please complete the reCAPTCHA verification first.',
  'auth/missing-email': 'Please provide an email address',
  'auth/invalid-action-code': 'The password reset link is invalid or has expired',
  'auth/credential-already-in-use': 'An account already exists with this email. Please sign in with that account.',
  'auth/requires-recent-login': 'This operation requires a recent login. Please sign in again.',
  'auth/provider-already-linked': 'This phone number is already linked to another account',
  'auth/invalid-verification-code': 'Invalid verification code. Please try again',
};

export type AuthResult = {
  success: boolean;
  data?: UserCredential | ConfirmationResult;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
};

function handleFirebaseError(error: any): AuthResult {
  if (error?.name === 'FirebaseError') {
    const errorCode = (error.customData?.message?.match(/\(([^)]+)\)/) || [])[1] || error.code;
    return {
      success: false,
      error: {
        code: errorCode,
        message: AUTH_ERROR_MESSAGES[errorCode] || 'An unexpected error occurred',
      },
    };
  }
  return {
    success: false,
    error: {
      code: 'unknown',
      message: 'An unexpected error occurred',
    },
  };
}

export async function fuiSignInWithEmailAndPassword(config: FUIConfig, email: string, password: string): Promise<AuthResult> {
  const auth = getAuth(config.app);
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return { success: true, data: await linkWithCredential(currentUser, credential) };
    }

    return { success: true, data: await signInWithCredential(auth, credential) };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiCreateUserWithEmailAndPassword(config: FUIConfig, email: string, password: string): Promise<AuthResult> {
  const auth = getAuth(config.app);
  try {
    const currentUser = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    if (currentUser?.isAnonymous) {
      return { success: true, data: await linkWithCredential(currentUser, credential) };
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiSignInWithPhoneNumber(config: FUIConfig, phoneNumber: string, recaptchaVerifier: ApplicationVerifier): Promise<AuthResult> {
  const auth = getAuth(config.app);
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
    return handleFirebaseError(error);
  }
}

export async function fuiConfirmPhoneNumber(confirmationResult: ConfirmationResult, verificationCode: string): Promise<AuthResult> {
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
    return handleFirebaseError(error);
  }
}

export async function fuiSendPasswordResetEmail(config: FUIConfig, email: string): Promise<AuthResult> {
  const auth = getAuth(config.app);
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      data: undefined,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export const fuiSendSignInLinkToEmail = async (config: FUIConfig, email: string): Promise<AuthResult> => {
  try {
    const auth = getAuth(config.app);
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
      message: 'Sign-in link sent successfully',
    };
  } catch (error) {
    return handleFirebaseError(error);
  }
};

export const fuiIsSignInWithEmailLink = (config: FUIConfig, link: string): boolean => {
  const auth = getAuth(config.app);
  return isSignInWithEmailLink(auth, link);
};

export const fuiSignInWithEmailLink = async (config: FUIConfig, email: string, link: string): Promise<AuthResult> => {
  try {
    const auth = getAuth(config.app);
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
    return handleFirebaseError(error);
  }
};

export async function fuiSignInAnonymously(config: FUIConfig): Promise<AuthResult> {
  const auth = getAuth(config.app);
  try {
    const result = await signInAnonymously(auth);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiUpgradeAnonymousUser(config: FUIConfig, email: string, password: string): Promise<AuthResult> {
  const auth = getAuth(config.app);
  const currentUser = auth.currentUser;
  if (!currentUser?.isAnonymous) {
    return {
      success: false,
      error: {
        code: 'auth/not-anonymous',
        message: 'Current user is not an anonymous user',
      },
    };
  }
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(currentUser, credential);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}
