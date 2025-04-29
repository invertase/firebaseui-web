import {
  AuthCredential,
  AuthProvider,
  linkWithCredential,
  linkWithRedirect,
  onAuthStateChanged,
  signInAnonymously,
  User,
  UserCredential,
} from 'firebase/auth';
import { FirebaseUIConfiguration } from './config';

export type BehaviorHandlers = {
  autoAnonymousLogin: (ui: FirebaseUIConfiguration) => Promise<User>;
  autoUpgradeAnonymousCredential: (
    ui: FirebaseUIConfiguration,
    credential: AuthCredential
  ) => Promise<UserCredential | undefined>;
  autoUpgradeAnonymousProvider: (ui: FirebaseUIConfiguration, provider: AuthProvider) => Promise<undefined | never>;
};

export type Behavior<T extends keyof BehaviorHandlers = keyof BehaviorHandlers> = Pick<BehaviorHandlers, T>;

export type BehaviorKey = keyof BehaviorHandlers;

export function hasBehavior(ui: FirebaseUIConfiguration, key: BehaviorKey): boolean {
  return !!ui.behaviors[key];
}

export function getBehavior<T extends BehaviorKey>(ui: FirebaseUIConfiguration, key: T): Behavior[T] {
  if (!hasBehavior(ui, key)) {
    throw new Error(`Behavior ${key} not found`);
  }

  return ui.behaviors[key] as Behavior[T];
}

export function autoAnonymousLogin(): Behavior<'autoAnonymousLogin'> {
  /** No-op on Server render */
  if (typeof window === 'undefined') {
    console.log('[autoAnonymousLogin] SSR mode — returning noop behavior');
    return {
      autoAnonymousLogin: async (_ui) => {
        /** Return a placeholder user object */
        return { uid: 'server-placeholder' } as unknown as User;
      },
    };
  }

  return {
    autoAnonymousLogin: async (ui) => {
      const auth = ui.getAuth();

      const user = await new Promise<User>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          ui.setState('signing-in');
          if (!user) {
            signInAnonymously(auth);
            return;
          }

          unsubscribe();
          resolve(user);
        });
      });
      ui.setState('idle');
      return user;
    },
  };
}

export function autoUpgradeAnonymousUsers(): Behavior<
  'autoUpgradeAnonymousCredential' | 'autoUpgradeAnonymousProvider'
> {
  return {
    autoUpgradeAnonymousCredential: async (ui, credential) => {
      const auth = ui.getAuth();
      const currentUser = auth.currentUser;

      // Check if the user is anonymous. If not, we can't upgrade them.
      if (!currentUser?.isAnonymous) {
        return;
      }

      ui.setState('linking');
      const result = await linkWithCredential(currentUser, credential);
      ui.setState('idle');
      return result;
    },
    autoUpgradeAnonymousProvider: async (ui, provider) => {
      const auth = ui.getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser?.isAnonymous) {
        return;
      }

      ui.setState('linking');
      await linkWithRedirect(currentUser, provider);
      // We don't modify state here since the user is redirected.
      // If we support popups, we'd need to modify state here.
    },
  };
}

// export function autoUpgradeAnonymousCredential(): RegisteredBehavior<'autoUpgradeAnonymousCredential'> {
//   return {
//     key: 'autoUpgradeAnonymousCredential',
//     handler: async (auth, credential) => {
//       const currentUser = auth.currentUser;

//       // Check if the user is anonymous. If not, we can't upgrade them.
//       if (!currentUser?.isAnonymous) {
//         return;
//       }

//       $state.set('linking');
//       const result = await linkWithCredential(currentUser, credential);
//       $state.set('idle');
//       return result;
//     },
//   };
// }

// export function autoUpgradeAnonymousProvider(): RegisteredBehavior<'autoUpgradeAnonymousCredential'> {
//   return {
//     key: 'autoUpgradeAnonymousProvider',
//     handler: async (auth, credential) => {
//       const currentUser = auth.currentUser;

//       // Check if the user is anonymous. If not, we can't upgrade them.
//       if (!currentUser?.isAnonymous) {
//         return;
//       }

//       $state.set('linking');
//       const result = await linkWithRedirect(currentUser, credential);
//       $state.set('idle');
//       return result;
//     },
//   };
// }
