import { BaseFormStore } from './base-form-store';
import type { EmailLinkFormState, LoginResult } from './types';
import { emailLinkFormSchema } from './types';
import { fuiSendSignInLinkToEmail } from '../auth';
import { getAuth } from 'firebase/auth';

export class EmailLinkFormStore extends BaseFormStore<EmailLinkFormState> {
  protected getInitialState(): EmailLinkFormState {
    return {
      email: '',
    };
  }

  public setEmail(email: string) {
    this.state.setKey('email', email);
  }

  public async submit(): Promise<LoginResult> {
    const validation = emailLinkFormSchema.safeParse(this.value);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    this.state.setKey('isLoading', true);
    this.state.setKey('error', null);

    try {
      const { email } = this.value;
      const auth = getAuth(this.config.app);
      const result = await fuiSendSignInLinkToEmail(auth, email);

      if (!result.success) {
        return {
          success: false,
          error: result.error || { code: 'auth/unknown', message: 'Unknown error occurred' },
        };
      }

      return { success: true, message: result.message || 'Email link sent successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      this.state.setKey('error', message);
      return {
        success: false,
        error: { code: 'auth/unknown', message },
      };
    } finally {
      this.state.setKey('isLoading', false);
    }
  }
}
