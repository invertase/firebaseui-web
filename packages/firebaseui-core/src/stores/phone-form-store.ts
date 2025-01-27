import { map } from 'nanostores';
import type { PhoneFormSchema } from './types';
import { phoneFormSchema } from './types';
import { fuiSignInWithPhoneNumber, fuiConfirmPhoneNumber } from '../auth';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import type { FUIConfig } from '../types';

export function createPhoneFormStore(config: FUIConfig) {
  let recaptchaVerifier: RecaptchaVerifier | null = null;
  let confirmationResult: ConfirmationResult | null = null;

  const state = map<PhoneFormSchema & { isLoading: boolean }>({
    phoneNumber: '',
    verificationCode: '',
    isLoading: false,
  });

  const setPhoneNumber = (phoneNumber: string) => {
    state.setKey('phoneNumber', phoneNumber);
  };

  const setVerificationCode = (verificationCode: string) => {
    state.setKey('verificationCode', verificationCode);
  };

  const setRecaptchaVerifier = (verifier: RecaptchaVerifier) => {
    recaptchaVerifier = verifier;
  };

  const reset = () => {
    state.set({
      phoneNumber: '',
      verificationCode: '',
      isLoading: false,
    });
    recaptchaVerifier = null;
    confirmationResult = null;
  };

  const submit = async () => {
    const validation = phoneFormSchema.safeParse(state.get());
    if (!validation.success) {
      throw validation.error;
    }

    state.setKey('isLoading', true);

    try {
      const { phoneNumber, verificationCode } = state.get();
      const auth = getAuth(config.app);

      if (!verificationCode) {
        if (!recaptchaVerifier) {
          throw new Error('reCAPTCHA verifier is not set');
        }

        confirmationResult = await fuiSignInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return confirmationResult;
      }

      if (!confirmationResult) {
        throw new Error('Please request a verification code first');
      }

      const result = await fuiConfirmPhoneNumber(confirmationResult, verificationCode);
      confirmationResult = null;
      return result;
    } finally {
      state.setKey('isLoading', false);
    }
  };

  return {
    state,
    setPhoneNumber,
    setVerificationCode,
    setRecaptchaVerifier,
    submit,
    reset,
  };
}
