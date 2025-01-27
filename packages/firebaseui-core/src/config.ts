import { computed, map, MapStore } from 'nanostores';
import { FUIConfig } from './types';

export const $config = map<Record<string, MapStore<FUIConfig>>>({});

export function initializeUI(config: FUIConfig, name: string = '[DEFAULT]'): MapStore<FUIConfig> {
  $config.setKey(name, map(config));
  return $config.get()[name]!;
}

export function getTranslations(config: MapStore<Record<string, FUIConfig>>, name: string = '[DEFAULT]') {
  return computed(config, (config) => config[name]?.translations);
}
