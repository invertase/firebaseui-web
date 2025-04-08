import { english, Locale, RegisteredTranslations, TranslationsConfig } from '@firebase-ui/translations';
import type { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { deepMap, DeepMapStore, map } from 'nanostores';
import { Behavior, type BehaviorHandlers, type BehaviorKey, getBehavior, hasBehavior } from './behaviors';
import { FirebaseUIState } from './state';

type FirebaseUIConfigurationOptions = {
  app: FirebaseApp;
  locale?: Locale | undefined;
  translations?: RegisteredTranslations[] | undefined;
  behaviors?: Partial<Behavior<keyof BehaviorHandlers>>[] | undefined;
  recaptchaMode?: 'normal' | 'invisible' | undefined;
};

export type FirebaseUIConfiguration = {
  app: FirebaseApp;
  getAuth: () => Auth;
  setLocale: (locale: Locale) => void;
  state: FirebaseUIState;
  setState: (state: FirebaseUIState) => void;
  locale: Locale;
  translations: TranslationsConfig;
  behaviors: Partial<Record<BehaviorKey, BehaviorHandlers[BehaviorKey]>>;
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

  // TODO: Is this right?
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
        const current = $config.get()[name]!;
        current.setKey(`locale`, locale);
      },
      state: 'loading',
      setState: (state: FirebaseUIState) => {
        const current = $config.get()[name]!;
        current.setKey(`state`, state);
      },
      translations,
      behaviors: behaviors ?? {},
      recaptchaMode: config.recaptchaMode ?? 'normal',
    })
  );

  const ui = $config.get()[name]!;

  // TODO(ehesp): Should this belong here - if not, where should it be?
  if (hasBehavior(ui.get(), 'autoAnonymousLogin')) {
    getBehavior(ui.get(), 'autoAnonymousLogin')(ui.get());
  } else {
    ui.setKey('state', 'idle');
  }

  return ui;
}
