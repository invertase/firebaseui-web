import { computed, map, MapStore } from 'nanostores';
import { FUIConfig } from './types';
import { fuiSignInAnonymously } from './auth';
import { getAuth } from 'firebase/auth';

export const $config = map<Record<string, MapStore<FUIConfig>>>({});

export function initializeUI(config: FUIConfig, name: string = '[DEFAULT]'): MapStore<FUIConfig> {
  $config.setKey(name, map(config));
  if (config.enableAutoAnonymousLogin && config.app) {
    void fuiSignInAnonymously(getAuth(config.app));
  }
  return $config.get()[name]!;
}

export function getTranslations(config: MapStore<Record<string, FUIConfig>>, name: string = '[DEFAULT]') {
  return computed(config, (config) => config[name]?.translations);
}
