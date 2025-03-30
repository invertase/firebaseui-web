import { english, Locale, RegisteredTranslations, TranslationsConfig } from '@firebase-ui/translations';
import type { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { map, MapStore } from 'nanostores';
import { Behavior, type BehaviorHandlers, type BehaviorKey, getBehavior, hasBehavior } from './behaviors';

type FirebaseUIConfiguration = {
  app: FirebaseApp | undefined; // TODO: Should this be optional? Or remove for Angular types?
  defaultLocale: Locale | undefined;
  translations: RegisteredTranslations[];
  behaviors: Behavior<keyof BehaviorHandlers>[];
  tosUrl: string | undefined;
  privacyPolicyUrl: string | undefined;
  recaptchaMode: 'normal' | 'invisible' | undefined;
};

export type InternalFirebaseUIConfiguration = {
  app: FirebaseApp | undefined;
  getAuth: () => Auth;
  defaultLocale: Locale;
  translations: TranslationsConfig;
  behaviors: Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>;
  tosUrl: string | undefined;
  privacyPolicyUrl: string | undefined;
  recaptchaMode: 'normal' | 'invisible';
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
  const translations: TranslationsConfig = config.translations.reduce((acc, translation) => {
    return {
      ...acc,
      [translation.locale]: translation.translations,
    };
  }, {} as TranslationsConfig);

  $config.setKey(
    name,
    map<InternalFirebaseUIConfiguration>({
      app: config.app,
      getAuth: () => getAuth(config.app),
      defaultLocale: config.defaultLocale ?? english.locale,
      translations,
      behaviors,
      tosUrl: config.tosUrl,
      privacyPolicyUrl: config.privacyPolicyUrl,
      recaptchaMode: config.recaptchaMode ?? 'normal',
    })
  );

  const ui = $config.get()[name]!;

  // TODO(ehesp): Should this belong here - if not, where should it be?
  if (hasBehavior(ui, 'autoAnonymousLogin')) {
    getBehavior(ui, 'autoAnonymousLogin')(getAuth(ui.get().app));
  }

  return ui;
}
