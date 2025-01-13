import { createStore, ObservableMap } from '@stencil/store';
import { FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { fuiSignInAnonymously } from './auth/auth-service';

export interface FUIConfig {
  app: FirebaseApp;
  enableAutoAnonymousLogin: boolean;
}

export type FUIConfigStore = ObservableMap<FUIConfig>;

export function initializeFirebaseUI(config: FUIConfig): ObservableMap<FUIConfig> {
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
