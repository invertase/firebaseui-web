import {
  fuiSignInWithEmailAndPassword,
  fuiCreateUserWithEmailAndPassword,
  fuiSignInWithPhoneNumber,
  fuiConfirmPhoneNumber,
  fuiSendPasswordResetEmail,
  fuiSendSignInLinkToEmail,
  fuiIsSignInWithEmailLink,
  fuiSignInWithEmailLink,
  fuiSignInAnonymously,
  fuiUpgradeAnonymousUser,
  type AuthResult,
  fuiSignInWithGoogle,
  fuiGetRedirectResult,
} from './auth-service';
import { z } from 'zod';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { FUIConfigStore } from '../config';

export const LoginTypes = ['email', 'phone', 'anonymous', 'emailLink', 'google'] as const;
export type LoginType = (typeof LoginTypes)[number];
export type AuthMode = 'signIn' | 'signUp';

const emailFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const emailLinkFormSchema = z.object({
  email: z.string().email(),
});

const phoneFormSchema = z.object({
  phoneNumber: z.string().min(10),
  verificationCode: z.string().optional(),
});

export type EmailFormState = z.infer<typeof emailFormSchema>;
export type PhoneFormState = z.infer<typeof phoneFormSchema>;
export type EmailLinkFormState = z.infer<typeof emailLinkFormSchema>;
export type LoginFormState = EmailFormState | PhoneFormState | EmailLinkFormState | null;

const defaultStates: Record<LoginType, LoginFormState> = {
  email: { email: '', password: '' },
  phone: { phoneNumber: '', verificationCode: '' },
  anonymous: { email: '', password: '' },
  emailLink: { email: '' },
  google: null,
};

const isEmailState = (state: LoginFormState): state is EmailFormState => 'email' in state;
const isPhoneState = (state: LoginFormState): state is PhoneFormState => 'phoneNumber' in state;

type LoginResult = {
  success: boolean;
  data?: AuthResult;
  error?: z.ZodError;
};

export class LoginFormController {
  protected formState: LoginFormState;
  private authMode: AuthMode = 'signIn';
  private loginType: LoginType = 'email';
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;
  private config: FUIConfigStore;

  constructor(config: FUIConfigStore) {
    this.formState = defaultStates.email;
    this.config = config;
  }

  public setAuthMode(mode: AuthMode): void {
    this.authMode = mode;
  }

  public getAuthMode(): AuthMode {
    return this.authMode;
  }

  public setLoginType(type: LoginType): void {
    this.loginType = type;
    this.reset();
  }

  public getLoginType(): LoginType {
    return this.loginType;
  }

  public setRecaptchaVerifier(verifier: RecaptchaVerifier): void {
    this.recaptchaVerifier = verifier;
  }

  public get state(): LoginFormState {
    return this.formState;
  }

  private updateState<T extends LoginFormState, K extends keyof T>(key: K, value: T[K]): void {
    if (key in this.formState) {
      (this.formState as T)[key] = value;
    }
  }

  public updateEmail(email: string): void {
    if (isEmailState(this.formState)) {
      this.updateState<EmailFormState, 'email'>('email', email);
    }
  }

  public updatePassword(password: string): void {
    if (isEmailState(this.formState)) {
      this.updateState<EmailFormState, 'password'>('password', password);
    }
  }

  public updatePhoneNumber(phoneNumber: string): void {
    if (isPhoneState(this.formState)) {
      this.updateState<PhoneFormState, 'phoneNumber'>('phoneNumber', phoneNumber);
    }
  }

  public updateVerificationCode(code: string): void {
    if (isPhoneState(this.formState)) {
      this.updateState<PhoneFormState, 'verificationCode'>('verificationCode', code);
    }
  }

  public async submit(loginType: LoginType): Promise<LoginResult> {
    const handlers: Record<LoginType, () => Promise<LoginResult>> = {
      email: async () => {
        const validation = emailFormSchema.safeParse(this.formState);
        if (!validation.success) {
          return { success: false, error: validation.error };
        }
        return { success: true, data: await this.handleEmailLogin() };
      },
      phone: async () => {
        const validation = phoneFormSchema.safeParse(this.formState);
        if (!validation.success) {
          return { success: false, error: validation.error };
        }
        return { success: true, data: await this.handlePhoneLogin() };
      },
      anonymous: async () => ({ success: true, data: await this.handleAnonymousLogin() }),
      emailLink: async () => {
        const validation = emailLinkFormSchema.safeParse(this.formState);
        if (!validation.success) {
          return { success: false, error: validation.error };
        }
        const state = this.formState as EmailLinkFormState;
        return { success: true, data: await this.handleEmailLinkSignIn(state.email) };
      },
      google: async () => {
        return { success: true, data: await this.handleGoogleSignIn() };
      },
    };

    const handler = handlers[loginType];
    if (!handler) {
      throw new Error(`Invalid login type: ${loginType}`);
    }

    return handler();
  }

  private async handleEmailLogin(): Promise<AuthResult> {
    const { email, password } = this.formState as EmailFormState;
    return this.authMode === 'signIn'
      ? await fuiSignInWithEmailAndPassword(this.config.state, email, password)
      : await fuiCreateUserWithEmailAndPassword(this.config.state, email, password);
  }

  private async handlePhoneLogin(): Promise<AuthResult> {
    const { phoneNumber, verificationCode } = this.formState as PhoneFormState;

    if (!verificationCode) {
      if (!this.recaptchaVerifier) {
        return {
          success: false,
          error: {
            code: 'auth/recaptcha-not-set',
            message: 'reCAPTCHA verifier is not set',
          },
        };
      }

      const result = await fuiSignInWithPhoneNumber(this.config.state, phoneNumber, this.recaptchaVerifier);
      if (result.success && result.data) {
        this.confirmationResult = result.data as ConfirmationResult;
      }
      return result;
    }

    if (!this.confirmationResult) {
      return {
        success: false,
        error: {
          code: 'auth/no-confirmation-result',
          message: 'Please request a verification code first',
        },
      };
    }

    const result = await fuiConfirmPhoneNumber(this.confirmationResult, verificationCode);
    if (result.success) {
      this.confirmationResult = null;
    }
    return result;
  }

  private async handleAnonymousLogin(): Promise<AuthResult> {
    return await fuiSignInAnonymously(this.config.state);
  }

  public async upgradeAnonymousUser(email: string, password: string): Promise<AuthResult> {
    return await fuiUpgradeAnonymousUser(this.config.state, email, password);
  }

  private async handleGoogleSignIn(): Promise<AuthResult> {
    return await fuiSignInWithGoogle(this.config.state);
  }

  public reset(): void {
    this.formState = defaultStates[this.loginType];
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  public async handleRedirectResult(): Promise<LoginResult> {
    return { success: true, data: await fuiGetRedirectResult(this.config.state) };
  }

  public dispose(): void {
    // No longer needed since we're not using store
  }

  public async handlePasswordReset(): Promise<AuthResult> {
    if (!isEmailState(this.formState)) {
      return {
        success: false,
        error: {
          code: 'auth/invalid-state',
          message: 'Password reset is only available for email login',
        },
      };
    }
    return await fuiSendPasswordResetEmail(this.config.state, this.formState.email);
  }

  public async handleEmailLinkSignIn(email: string): Promise<AuthResult> {
    return await fuiSendSignInLinkToEmail(this.config.state, email);
  }

  public async completeEmailLinkSignIn(email: string, link: string): Promise<AuthResult> {
    return await fuiSignInWithEmailLink(this.config.state, email, link);
  }

  public isEmailLinkSignIn(link: string): boolean {
    if (!this.config) {
      return false;
    }
    return fuiIsSignInWithEmailLink(this.config.state, link);
  }
}
