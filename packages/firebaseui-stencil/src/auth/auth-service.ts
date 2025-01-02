import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { globalConfig, isInitialized } from '../config';

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
};

export type AuthResult = {
  success: boolean;
  data?: UserCredential;
  error?: {
    code: string;
    message: string;
  };
};

function handleFirebaseError(error: any): AuthResult {
  if (error?.name === 'FirebaseError') {
    const match = error.customData?.message?.match(/\(([^)]+)\)/);
    const errorCode = match ? match[1] : error.code;

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
