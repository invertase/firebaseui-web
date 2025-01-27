import { ERROR_CODE_MAP, getTranslation, type TranslationsConfig } from './translations';

export class FirebaseUIError extends Error {
  code: string;

  constructor(error: any, translations?: TranslationsConfig) {
    const errorCode = error?.customData?.message?.match?.(/\(([^)]+)\)/)?.at(1) || error?.code || 'unknown';
    const translationKey = ERROR_CODE_MAP[errorCode] || 'unknownError';
    const message = getTranslation('errors', translationKey, translations);

    super(message);
    this.name = 'FirebaseUIError';
    this.code = errorCode;
  }
}
