import {
  english,
  ERROR_CODE_MAP,
  ErrorCode,
  getTranslation,
  Locale,
  TranslationsConfig,
} from '@firebase-ui/translations';
import { FirebaseUI } from './config';
export class FirebaseUIError extends Error {
  code: string;

  constructor(error: any, translations?: TranslationsConfig, locale?: Locale) {
    const errorCode: ErrorCode = error?.customData?.message?.match?.(/\(([^)]+)\)/)?.at(1) || error?.code || 'unknown';
    const translationKey = ERROR_CODE_MAP[errorCode] || 'unknownError';
    const message = getTranslation('errors', translationKey, translations, locale ?? english.locale);

    super(message);
    this.name = 'FirebaseUIError';
    this.code = errorCode;
  }
}

export function handleFirebaseError(
  ui: FirebaseUI,
  error: any,
  opts?: {
    enableHandleExistingCredential?: boolean;
  }
): never {
  const { translations, defaultLocale } = ui.get();
  if (error?.code === 'auth/account-exists-with-different-credential' && opts?.enableHandleExistingCredential) {
    if (error.credential) {
      window.sessionStorage.setItem('pendingCred', JSON.stringify(error.credential));
    }

    throw new FirebaseUIError(
      {
        code: 'auth/account-exists-with-different-credential',
        customData: {
          email: error.customData?.email,
        },
      },
      translations,
      defaultLocale
    );
  }

  // TODO: Debug why instanceof FirebaseError is not working
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, translations, defaultLocale);
  }
  throw new FirebaseUIError({ code: 'unknown' }, translations, defaultLocale);
}
