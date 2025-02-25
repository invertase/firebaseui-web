import { ERROR_CODE_MAP, getTranslation, type TranslationsConfig } from './translations';

export class FirebaseUIError extends Error {
  code: string;

  constructor(error: any, translations?: TranslationsConfig, language?: string) {
    const errorCode = error?.customData?.message?.match?.(/\(([^)]+)\)/)?.at(1) || error?.code || 'unknown';
    const translationKey = ERROR_CODE_MAP[errorCode] || 'unknownError';
    const message = getTranslation('errors', translationKey, translations, language);

    super(message);
    this.name = 'FirebaseUIError';
    this.code = errorCode;
  }
}

export function handleFirebaseError(error: any, translations?: TranslationsConfig, language?: string): never {
  // TODO: Debug why instanceof FirebaseError is not working
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, translations, language);
  }
  throw new FirebaseUIError({ code: 'unknown' }, translations, language);
}
