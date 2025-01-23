import { atom, computed } from 'nanostores'

export * from './auth';
export * from './stores';
export * from './types';
export * from './translations';

import { FUIConfig } from './types';

export const $config = atom<FUIConfig>({});

export function createConfigStore(config: FUIConfig) {
  return atom<FUIConfig>(config);
}

export function getTranslations(config: ReturnType<typeof createConfigStore>) {
  return computed(config, (config) => config.translations);
}