import { UserCredential } from 'firebase/auth';
import { ERROR_CODE_MAP, getTranslation, type TranslationsConfig } from './translations';
import { FirebaseUI } from './config';
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

export function handleFirebaseError(
  error: any,
  // opts?: { language?: string; translations?: TranslationsConfig; enableHandleExistingCredential?: boolean }
  ui: FirebaseUI
): never {
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
      opts?.translations,
      opts?.language
    );
  }

  // TODO: Debug why instanceof FirebaseError is not working
  if (error?.name === 'FirebaseError') {
    throw new FirebaseUIError(error, opts?.translations, opts?.language);
  }
  throw new FirebaseUIError({ code: 'unknown' }, opts?.translations, opts?.language);
}
