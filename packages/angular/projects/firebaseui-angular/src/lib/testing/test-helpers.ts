import { Provider } from '@angular/core';
import { FirebaseUi } from '../provider';
import { Auth } from '@angular/fire/auth';
import { InjectionToken } from '@angular/core';
import { of } from 'rxjs';
import { NANOSTORES } from '@nanostores/angular';

// Mock for the Auth service
export const mockAuth = {
  currentUser: null,
};

// Mock for FirebaseUi provider
export const mockFirebaseUi = {
  config: () =>
    of({
      language: 'en',
      enableAutoUpgradeAnonymous: false,
      enableHandleExistingCredential: false,
      translations: {},
    }),
  translation: (category: string, key: string) => {
    const translations: Record<string, Record<string, string>> = {
      labels: {
        emailAddress: 'Email Address',
        password: 'Password',
        forgotPassword: 'Forgot Password',
        signIn: 'Sign In',
        register: 'Register',
        displayName: 'Display Name',
        confirmPassword: 'Confirm Password',
        resetPassword: 'Reset Password',
        backToSignIn: 'Back to Sign In',
      },
      prompts: {
        noAccount: "Don't have an account?",
        alreadyAccount: 'Already have an account?',
      },
      messages: {
        checkEmailForReset: 'Check your email for reset instructions',
      },
      errors: {
        unknownError: 'An unknown error occurred',
        invalidEmail: 'Please enter a valid email address',
        passwordTooShort: 'Password should be at least 8 characters',
        passwordsDoNotMatch: 'Passwords do not match',
      },
    };
    return of(translations[category]?.[key] || `${category}.${key}`);
  },
};

// Mock for the NANOSTORES service
export const mockNanoStores = {
  useStore: () =>
    of({
      language: 'en',
      enableAutoUpgradeAnonymous: false,
      enableHandleExistingCredential: false,
      translations: {},
    }),
};

// Mock for the FirebaseUI store token
export const FIREBASE_UI_STORE = new InjectionToken<any>('firebaseui.store');

// Helper function to get all Firebase UI related providers for testing
export function getFirebaseUITestProviders(): Provider[] {
  return [
    { provide: Auth, useValue: mockAuth },
    { provide: FirebaseUi, useValue: mockFirebaseUi },
    { provide: NANOSTORES, useValue: mockNanoStores },
    {
      provide: FIREBASE_UI_STORE,
      useValue: {
        config: {
          language: 'en',
          enableAutoUpgradeAnonymous: false,
          enableHandleExistingCredential: false,
          translations: {},
        },
      },
    },
  ];
}
