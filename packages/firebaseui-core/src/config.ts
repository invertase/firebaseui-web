import { english, Locale, RegisteredTranslations, TranslationsConfig } from '@firebase-ui/translations';
import type { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { deepMap, DeepMapStore, map } from 'nanostores';
import { Behavior, type BehaviorHandlers, type BehaviorKey, getBehavior, hasBehavior } from './behaviors';
import { FirebaseUIState } from './state';

type FirebaseUIConfigurationOptions = {
  app: FirebaseApp | undefined; // TODO: Should this be optional? Or remove for Angular types?
  locale?: Locale | undefined;
  translations?: RegisteredTranslations[] | undefined;
  behaviors?: Behavior<keyof BehaviorHandlers>[] | undefined;
  tosUrl?: string | undefined;
  privacyPolicyUrl?: string | undefined;
  recaptchaMode?: 'normal' | 'invisible' | undefined;
};

export type FirebaseUIConfiguration = {
  app: FirebaseApp | undefined;
  getAuth: () => Auth;
  setLocale: (locale: Locale) => void;
  state: FirebaseUIState;
  setState: (state: FirebaseUIState) => void;
  locale: Locale;
  translations: TranslationsConfig;
  behaviors: Partial<Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>>;
  tosUrl: string | undefined;
  privacyPolicyUrl: string | undefined;
  recaptchaMode: 'normal' | 'invisible';
};

export const $config = map<Record<string, DeepMapStore<FirebaseUIConfiguration>>>({});

export type FirebaseUI = DeepMapStore<FirebaseUIConfiguration>;

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
    deepMap<FirebaseUIConfiguration>({
      app: config.app,
      getAuth: () => getAuth(config.app),
      locale: config.locale ?? english.locale,
      setLocale: (locale: Locale) => {
        // @ts-ignore `value` of `setKey` is not correctly typed. It's not `DeepMapStore<FirebaseUIConfiguration>`
        $config.setKey(`${name}.locale`, locale);
      },
      state: 'loading',
      setState: (state: FirebaseUIState) => {
        // @ts-ignore `value` of `setKey` is not correctly typed. It's not `DeepMapStore<FirebaseUIConfiguration>`
        $config.setKey(`${name}.state`, state);
      },
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
    getBehavior(ui.get(), 'autoAnonymousLogin')(ui.get());
  }

  return ui;
}
