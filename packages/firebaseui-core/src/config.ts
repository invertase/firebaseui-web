import { computed, map, MapStore } from 'nanostores';
import { FUIConfig } from './types';
import type { FirebaseApp } from 'firebase/app';
import { Behavior, type BehaviorKey, type BehaviorHandlers, hasBehavior, getBehavior } from './behaviors';
import { getAuth } from 'firebase/auth';

type FirebaseUIConfiguration = {
  app: FirebaseApp; // TODO: Should this be optional? Or remove for Angular types?
  behaviors: Behavior<keyof BehaviorHandlers>[];
};

export type InternalFirebaseUIConfiguration = {
  app: FirebaseApp;
  behaviors: Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>;
};

export const $config = map<Record<string, MapStore<InternalFirebaseUIConfiguration>>>({});

export type FirebaseUI = MapStore<InternalFirebaseUIConfiguration>;

export function initializeUI(
  config: FirebaseUIConfiguration,
  name: string = '[DEFAULT]'
): MapStore<InternalFirebaseUIConfiguration> {
  // Reduce the behaviors to a single object.
  const behaviors = config.behaviors.reduce(
    (acc, behavior) => {
      return {
        ...acc,
        ...behavior,
      };
    },
    {} as Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>
  );

  $config.setKey(
    name,
    map<InternalFirebaseUIConfiguration>({
      app: config.app as FirebaseApp,
      behaviors,
    })
  );

  const ui = $config.get()[name]!;

  // TODO(ehesp): Should this belong here - if not, where should it be?
  if (hasBehavior(ui, 'autoAnonymousLogin')) {
    getBehavior(ui, 'autoAnonymousLogin')(getAuth(ui.get().app));
  }

  return ui;
}

export function getTranslations(config: MapStore<Record<string, FUIConfig>>, name: string = '[DEFAULT]') {
  return computed(config, (config) => config[name]?.translations);
}
