import { computed, map, MapStore } from 'nanostores';
import { FUIConfig } from './types';
import { fuiSignInAnonymously } from './auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const $config = map<Record<string, MapStore<FUIConfig>>>({});

export function initializeUI(config: FUIConfig, name: string = '[DEFAULT]'): MapStore<FUIConfig> {
  $config.setKey(name, map(config));
  if (config.enableAutoAnonymousLogin && config.app) {
    const unsubscribe = onAuthStateChanged(getAuth(config.app), (user) => {
      if (!user) {
        void fuiSignInAnonymously(getAuth(config.app));
      }
      unsubscribe();
    });
  }
  return $config.get()[name]!;
}

export function getTranslations(config: MapStore<Record<string, FUIConfig>>, name: string = '[DEFAULT]') {
  return computed(config, (config) => config[name]?.translations);
}
