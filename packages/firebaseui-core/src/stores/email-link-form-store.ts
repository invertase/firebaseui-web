import { map } from 'nanostores';
import type { EmailLinkFormSchema } from './types';
import { emailLinkFormSchema } from './types';
import { fuiSendSignInLinkToEmail } from '../auth';
import { getAuth } from 'firebase/auth';
import type { FUIConfig } from '../types';

export function createEmailLinkFormStore(config: FUIConfig) {
  const state = map<EmailLinkFormSchema & { isLoading: boolean }>({
    email: '',
    isLoading: false,
  });

  const setEmail = (email: string) => {
    state.setKey('email', email);
  };

  const reset = () => {
    state.set({
      email: '',
      isLoading: false,
    });
  };

  const submit = async () => {
    const validation = emailLinkFormSchema.safeParse(state.get());
    if (!validation.success) {
      throw validation.error;
    }

    state.setKey('isLoading', true);

    try {
      const { email } = state.get();
      const auth = getAuth(config.app);
      await fuiSendSignInLinkToEmail(auth, email);
    } finally {
      state.setKey('isLoading', false);
    }
  };

  return {
    state,
    setEmail,
    submit,
    reset,
  };
}
