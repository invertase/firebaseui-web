import { FirebaseApp } from 'firebase/app';
import { UserCredential, ConfirmationResult } from 'firebase/auth';

export interface FUIConfig {
  app?: FirebaseApp;
  enableAutoAnonymousLogin?: boolean;
  providers?: {
    emailPassword?: {
      allowRegistration?: boolean;
    };
  };
}

export type AuthResult = {
  success: boolean;
  data?: UserCredential | ConfirmationResult | undefined;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
};
