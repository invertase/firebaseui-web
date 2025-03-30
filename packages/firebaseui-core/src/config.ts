import { english, Locale, RegisteredTranslations, TranslationsConfig } from '@firebase-ui/translations';
import type { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { map, MapStore } from 'nanostores';
import { Behavior, type BehaviorHandlers, type BehaviorKey, getBehavior, hasBehavior } from './behaviors';

type FirebaseUIConfigurationOptions = {
  app: FirebaseApp | undefined; // TODO: Should this be optional? Or remove for Angular types?
  defaultLocale?: Locale | undefined;
  translations?: RegisteredTranslations[] | undefined;
  behaviors?: Behavior<keyof BehaviorHandlers>[] | undefined;
  tosUrl?: string | undefined;
  privacyPolicyUrl?: string | undefined;
  recaptchaMode?: 'normal' | 'invisible' | undefined;
};

export type FirebaseUIConfiguration = {
  app: FirebaseApp | undefined;
  getAuth: () => Auth;
  defaultLocale: Locale;
  translations: TranslationsConfig;
  behaviors: Partial<Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>>;
  tosUrl: string | undefined;
  privacyPolicyUrl: string | undefined;
  recaptchaMode: 'normal' | 'invisible';
};

export const $config = map<Record<string, MapStore<FirebaseUIConfiguration>>>({});

export type FirebaseUI = MapStore<FirebaseUIConfiguration>;

export function initializeUI(config: FirebaseUIConfigurationOptions, name: string = '[DEFAULT]'): FirebaseUI {
  // Reduce the behaviors to a single object.
  const behaviors = config.behaviors?.reduce(
    (acc, behavior) => {
      return {
        ...acc,
        ...behavior,
      };
    },
    {} as Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>
  );

  config.translations ??= [];
  config.translations.push(english);
  const translations = config.translations?.reduce((acc, translation) => {
    return {
      ...acc,
      [translation.locale]: translation.translations,
    };
  }, {} as TranslationsConfig);

  $config.setKey(
    name,
    map<FirebaseUIConfiguration>({
      app: config.app,
      getAuth: () => getAuth(config.app),
      defaultLocale: config.defaultLocale ?? english.locale,
      translations,
      behaviors: behaviors ?? {},
      tosUrl: config.tosUrl,
      privacyPolicyUrl: config.privacyPolicyUrl,
      recaptchaMode: config.recaptchaMode ?? 'normal',
    })
  );

  const ui = $config.get()[name]!;

  // TODO(ehesp): Should this belong here - if not, where should it be?
  if (hasBehavior(ui.get(), 'autoAnonymousLogin')) {
    getBehavior(ui.get(), 'autoAnonymousLogin')(getAuth(ui.get().app));
  }

  return ui;
}
