import { createStore, ObservableMap } from '@stencil/store';
import { fuiSignInWithEmailAndPassword, fuiCreateUserWithEmailAndPassword, type AuthResult } from './auth-service';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormState = z.infer<typeof loginFormSchema>;

const defaultStoreValue: LoginFormState = {
  email: '',
  password: '',
};

export const LoginTypes = ['email', 'phone', 'anonymous'] as const;
export type LoginType = (typeof LoginTypes)[number];

type LoginResult = {
  success: boolean;
  data?: AuthResult;
  error?: z.ZodError;
};

export type AuthMode = 'signIn' | 'signUp';

export class LoginFormController {
  protected store: ObservableMap<LoginFormState>;
  public zodSchema: typeof loginFormSchema;
  private authMode: AuthMode = 'signIn';

  constructor() {
    this.store = createStore<LoginFormState>(defaultStoreValue);
    this.zodSchema = loginFormSchema;
  }

  public setAuthMode(mode: AuthMode): void {
    this.authMode = mode;
  }

  public getAuthMode(): AuthMode {
    return this.authMode;
  }

  public get state(): LoginFormState {
    return this.store.state;
  }

  public updateEmail(email: string): void {
    this.store.state.email = email;
  }

  public updatePassword(password: string): void {
    this.store.state.password = password;
  }

  public async submit(loginType: LoginType): Promise<LoginResult> {
    if (!LoginTypes.includes(loginType)) {
      throw new Error(`Invalid login type: ${loginType}`);
    }

    switch (loginType) {
      case 'email': {
        const validation = this.zodSchema.safeParse(this.store.state);
        if (!validation.success) {
          return { success: false, error: validation.error };
        }
        return { success: true, data: await this.handleEmailLogin() };
      }
      case 'phone':
        return { success: true, data: await this.handlePhoneLogin() };
      case 'anonymous':
        return { success: true, data: await this.handleAnonymousLogin() };
    }
  }

  private async handleEmailLogin(): Promise<AuthResult> {
    const { email, password } = this.store.state;
    return this.authMode === 'signIn' ? await fuiSignInWithEmailAndPassword(email, password) : await fuiCreateUserWithEmailAndPassword(email, password);
  }

  private async handlePhoneLogin(): Promise<AuthResult> {
    // TODO: Implement phone login
    return {
      success: false,
      error: {
        code: 'auth/not-implemented',
        message: 'Phone login is not implemented yet',
      },
    };
  }

  private async handleAnonymousLogin(): Promise<AuthResult> {
    // TODO: Implement anonymous login
    return {
      success: false,
      error: {
        code: 'auth/not-implemented',
        message: 'Anonymous login is not implemented yet',
      },
    };
  }

  public reset(): void {
    this.store.state = defaultStoreValue;
  }

  public dispose(): void {
    this.store.dispose();
  }
}
