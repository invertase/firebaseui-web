import { map } from 'nanostores';
import type { EmailFormSchema } from './types';
import { emailFormSchema } from './types';
import { fuiSignInWithEmailAndPassword, fuiCreateUserWithEmailAndPassword } from '../auth';
import { getAuth } from 'firebase/auth';
import type { FUIConfig } from '../types';

export function createEmailFormStore(config: FUIConfig) {
  const state = map<EmailFormSchema & { isLoading: boolean }>({
    email: '',
    password: '',
    authMode: 'signIn',
    isLoading: false,
  });

  const setEmail = (email: string) => {
    state.setKey('email', email);
  };

  const setPassword = (password: string) => {
    state.setKey('password', password);
  };

  const reset = () => {
    state.set({
      email: '',
      password: '',
      authMode: 'signIn',
      isLoading: false,
    });
  };

  const submit = async () => {
    const validation = emailFormSchema.safeParse(state.get());
    if (!validation.success) {
      throw validation.error;
    }

    state.setKey('isLoading', true);

    try {
      const { email, password, authMode } = state.get();
      const auth = getAuth(config.app);

      return authMode === 'signIn'
        ? await fuiSignInWithEmailAndPassword(auth, email, password)
        : await fuiCreateUserWithEmailAndPassword(auth, email, password);
    } finally {
      state.setKey('isLoading', false);
    }
  };

  return {
    state,
    setEmail,
    setPassword,
    submit,
    reset,
  };
}
