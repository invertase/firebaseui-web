import { BaseFormStore } from './base-form-store';
import type { PhoneFormState, LoginResult } from './types';
import { phoneFormSchema } from './types';
import { fuiSignInWithPhoneNumber, fuiConfirmPhoneNumber } from '../auth';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

export class PhoneFormStore extends BaseFormStore<PhoneFormState> {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  protected getInitialState(): PhoneFormState {
    return {
      phoneNumber: '',
      verificationCode: '',
    };
  }

  public setPhoneNumber(phoneNumber: string) {
    this.state.setKey('phoneNumber', phoneNumber);
  }

  public setVerificationCode(verificationCode: string) {
    this.state.setKey('verificationCode', verificationCode);
  }

  public setRecaptchaVerifier(verifier: RecaptchaVerifier) {
    this.recaptchaVerifier = verifier;
  }

  public async submit(): Promise<LoginResult> {
    const validation = phoneFormSchema.safeParse(this.value);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    this.state.setKey('isLoading', true);
    this.state.setKey('error', null);

    try {
      const { phoneNumber, verificationCode } = this.value;
      const auth = getAuth(this.config.app);

      if (!verificationCode) {
        if (!this.recaptchaVerifier) {
          throw new Error('reCAPTCHA verifier is not set');
        }

        const result = await fuiSignInWithPhoneNumber(auth, phoneNumber, this.recaptchaVerifier);

        if (!result.success || !result.data) {
          return {
            success: false,
            error: result.error || { code: 'auth/unknown', message: 'Unknown error occurred' },
          };
        }

        this.confirmationResult = result.data as ConfirmationResult;
        return { success: true, data: result.data };
      }

      if (!this.confirmationResult) {
        throw new Error('Please request a verification code first');
      }

      const result = await fuiConfirmPhoneNumber(this.confirmationResult, verificationCode);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || { code: 'auth/unknown', message: 'Unknown error occurred' },
        };
      }

      this.confirmationResult = null;
      return { success: true, data: result.data };
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

  public override reset() {
    super.reset();
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }
}
