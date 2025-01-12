import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
  signInWithPhoneNumber,
  ConfirmationResult,
  ApplicationVerifier,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { globalConfig, isInitialized } from '../config';

// Declare global window property for test mode
declare global {
  interface Window {
    confirmationResult: ConfirmationResult | null;
  }
}

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
  'auth/invalid-verification-code': 'Invalid verification code',
  'auth/code-expired': 'The verification code has expired',
  'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
  'auth/missing-verification-id': 'Please complete the reCAPTCHA verification first.',
  'auth/missing-email': 'Please provide an email address',
  'auth/invalid-action-code': 'The password reset link is invalid or has expired',
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
  console.log({ ...error });
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

export async function fuiSignInWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
  if (!isInitialized()) {
    throw new Error('FirebaseUI is not initialized');
  }
  const auth = getAuth(globalConfig.state.app);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiCreateUserWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
  if (!isInitialized()) {
    throw new Error('FirebaseUI is not initialized');
  }
  const auth = getAuth(globalConfig.state.app);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiSignInWithPhoneNumber(phoneNumber: string, recaptchaVerifier: ApplicationVerifier): Promise<AuthResult> {
  if (!isInitialized()) {
    throw new Error('FirebaseUI is not initialized');
  }
  const auth = getAuth(globalConfig.state.app);
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { success: true, data: confirmationResult };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiConfirmPhoneNumber(confirmationResult: ConfirmationResult, verificationCode: string): Promise<AuthResult> {
  if (!isInitialized()) {
    throw new Error('FirebaseUI is not initialized');
  }
  try {
    const result = await confirmationResult.confirm(verificationCode);
    return { success: true, data: result };
  } catch (error) {
    return handleFirebaseError(error);
  }
}

export async function fuiSendPasswordResetEmail(email: string): Promise<AuthResult> {
  if (!isInitialized()) {
    throw new Error('FirebaseUI is not initialized');
  }
  const auth = getAuth(globalConfig.state.app);
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

export const fuiSendSignInLinkToEmail = async (email: string): Promise<AuthResult> => {
  try {
    const auth = getAuth(globalConfig.state.app);
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);

    return {
      success: true,
      message: 'Sign-in link sent successfully',
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const fuiIsSignInWithEmailLink = (link: string): boolean => {
  const auth = getAuth(globalConfig.state.app);
  return isSignInWithEmailLink(auth, link);
};

export const fuiSignInWithEmailLink = async (email: string, link: string): Promise<AuthResult> => {
  try {
    const auth = getAuth(globalConfig.state.app);
    const result = await signInWithEmailLink(auth, email, link);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
