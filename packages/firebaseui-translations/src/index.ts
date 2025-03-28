import { enUS } from "./locales/en-us";
import { Translations } from "./types";

export type * from './types';

export type Locale = 'en-US' | `${string}-${string}`;

export function customLanguage(locale: Locale, translations: Translations) {
  return {
    locale,
    translations,
  }
}

export const english = customLanguage('en-US', enUS);

export type RegisteredTranslations = ReturnType<typeof customLanguage>;