// import { BaseFormStore } from './base-form-store';
// import type { EmailFormState, LoginResult, AuthMode } from './types';
// import { emailFormSchema } from './types';
// import { fuiSignInWithEmailAndPassword, fuiCreateUserWithEmailAndPassword } from '../auth';
// import { getAuth } from 'firebase/auth';

// export class EmailFormStore extends BaseFormStore<EmailFormState> {
  // protected getInitialState(): EmailFormState {
  //   return {
  //     email: '',
  //     password: '',
  //     authMode: 'signIn',
  //   };
  // }

  // public setEmail(email: string) {
  //   this.state.setKey('email', email);
  // }

  // public setPassword(password: string) {
  //   this.state.setKey('password', password);
  // }


  // public async submit(): Promise<LoginResult> {
  //   const validation = emailFormSchema.safeParse(this.value);
  //   if (!validation.success) {
  //     return { success: false, error: validation.error };
  //   }

  //   this.state.setKey('isLoading', true);
  //   this.state.setKey('error', null);

  //   try {
  //     const { email, password, authMode } = this.value;
  //     const auth = getAuth(this.config.app);
  //     const authResult =
  //       authMode === 'signIn'
  //         ? await fuiSignInWithEmailAndPassword(auth, email, password)
  //         : await fuiCreateUserWithEmailAndPassword(auth, email, password);

  //     if (!authResult.success || !authResult.data) {
  //       return {
  //         success: false,
  //         error: authResult.error || { code: 'auth/unknown', message: 'Unknown error occurred' },
  //       };
  //     }

  //     return { success: true, data: authResult.data };
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'An unknown error occurred';
  //     this.state.setKey('error', message);
  //     return {
  //       success: false,
  //       error: { code: 'auth/unknown', message },
  //     };
  //   } finally {
  //     this.state.setKey('isLoading', false);
  //   }
  // }
// }
