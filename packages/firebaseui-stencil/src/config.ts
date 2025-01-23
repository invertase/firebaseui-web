import { createStore, ObservableMap } from '@stencil/store';
import { FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fuiSignInAnonymously } from './auth/auth-service';
import { Translations } from './types/translations';
import { ZodSchema } from 'zod';

export interface FUIConfig {
  app?: FirebaseApp;
  enableAutoAnonymousLogin?: boolean;
  providers?: {
    emailPassword?: {
      allowRegistration?: boolean;
    };
  };
  validations?: Record<string, ZodSchema>;
  translations?: Record<string, Translations>;
}

export type FUIConfigStore = ObservableMap<FUIConfig>;

export function initializeFirebaseUI(config: FUIConfig): FUIConfigStore {
  const store = createStore<FUIConfig>(config);

  if (config.enableAutoAnonymousLogin) {
    const auth = getAuth(config.app);
    onAuthStateChanged(auth, async user => {
      if (!user) {
        await fuiSignInAnonymously(config);
      }
    });
  }

  return store;
}
