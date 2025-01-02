import { createStore } from '@stencil/store';
import { FirebaseApp } from 'firebase/app';

export interface GlobalConfig {
  app: FirebaseApp | null;
}

export function isInitialized() {
  return globalConfig.state.app !== null;
}

export function initializeFirebaseUI(config: GlobalConfig) {
  globalConfig.state = config;
}

export const globalConfig = createStore<GlobalConfig>({
  app: null,
});
