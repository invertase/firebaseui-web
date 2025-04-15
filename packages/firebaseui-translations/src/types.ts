export type TranslationCategory = keyof Required<Translations>;
export type TranslationKey<T extends TranslationCategory> =
  keyof Required<Translations>[T];
export type TranslationSet<T extends TranslationCategory> = Record<
  TranslationKey<T>,
  string
>;
export type ErrorKey = keyof Required<Translations>["errors"];
export type MessageKey = keyof Required<Translations>["messages"];
export type LabelKey = keyof Required<Translations>["labels"];
export type PromptKey = keyof Required<Translations>["prompts"];
export type TranslationsConfig = Partial<Record<string, Partial<Translations>>>;

export type Translations = {
  errors?: {
    userNotFound?: string;
    wrongPassword?: string;
    invalidEmail?: string;
    userDisabled?: string;
    networkRequestFailed?: string;
    tooManyRequests?: string;
    emailAlreadyInUse?: string;
    weakPassword?: string;
    operationNotAllowed?: string;
    invalidPhoneNumber?: string;
    missingPhoneNumber?: string;
    quotaExceeded?: string;
    codeExpired?: string;
    captchaCheckFailed?: string;
    missingVerificationId?: string;
    missingEmail?: string;
    invalidActionCode?: string;
    credentialAlreadyInUse?: string;
    requiresRecentLogin?: string;
    providerAlreadyLinked?: string;
    invalidVerificationCode?: string;
    unknownError?: string;
    popupClosed?: string;
    accountExistsWithDifferentCredential?: string;
  };
  messages?: {
    passwordResetEmailSent?: string;
    signInLinkSent?: string;
    verificationCodeFirst?: string;
    checkEmailForReset?: string;
    dividerOr?: string;
    termsAndPrivacy?: string;
  };
  labels?: {
    emailAddress?: string;
    password?: string;
    forgotPassword?: string;
    register?: string;
    signIn?: string;
    resetPassword?: string;
    createAccount?: string;
    backToSignIn?: string;
    signInWithPhone?: string;
    phoneNumber?: string;
    verificationCode?: string;
    sendCode?: string;
    verifyCode?: string;
    signInWithGoogle?: string;
    signInWithEmailLink?: string;
    sendSignInLink?: string;
    termsOfService?: string;
    privacyPolicy?: string;
    resendCode?: string;
    sending?: string;
  };
  prompts?: {
    noAccount?: string;
    haveAccount?: string;
    enterEmailToReset?: string;
    signInToAccount?: string;
    enterDetailsToCreate?: string;
    enterPhoneNumber?: string;
    enterVerificationCode?: string;
    enterEmailForLink?: string;
  };
};
