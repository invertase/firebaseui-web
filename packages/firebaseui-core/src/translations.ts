import { getTranslation as _getTranslation, TranslationCategory, TranslationKey } from '@firebase-ui/translations';
import { FirebaseUIConfiguration } from './config';

export function getTranslation<T extends TranslationCategory>(
  ui: FirebaseUIConfiguration,
  category: T,
  key: TranslationKey<T>
) {
  return _getTranslation(category, key, ui.translations, ui.locale);
}
