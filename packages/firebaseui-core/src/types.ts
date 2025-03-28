import { FirebaseApp } from 'firebase/app';
export interface FUIConfig {
  app?: FirebaseApp;
  language?: string;
  enableAutoAnonymousLogin?: boolean;
  enableAutoUpgradeAnonymous?: boolean;
  enableHandleExistingCredential?: boolean;
  // translations?: Partial<Record<string, Partial<TranslationStrings>>>;
  translations?: any;
  tosUrl?: string;
  privacyPolicyUrl?: string;
  recaptchaMode?: 'normal' | 'invisible';
}

export interface CountryData {
  name: string;
  dialCode: string;
  code: string;
  emoji: string;
}
