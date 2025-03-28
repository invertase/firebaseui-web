import {
  Auth,
  AuthCredential,
  AuthProvider,
  linkWithCredential,
  linkWithRedirect,
  onAuthStateChanged,
  signInAnonymously,
  User,
  UserCredential,
} from 'firebase/auth';
import { FirebaseUI } from './config';
import { $state } from './state';

export type BehaviorHandlers = {
  autoAnonymousLogin: (auth: Auth) => Promise<User>;
  autoUpgradeAnonymousCredential: (auth: Auth, credential: AuthCredential) => Promise<UserCredential | undefined>;
  autoUpgradeAnonymousProvider: (auth: Auth, provider: AuthProvider) => Promise<undefined | never>;
  autoUpgradeAnonymousLink: (auth: Auth) => {
    setStorageItem: (key: string, value: string) => void;
    removeStorageItem: (key: string) => void;
  };
};

export type Behavior<T extends keyof BehaviorHandlers = keyof BehaviorHandlers> = Pick<BehaviorHandlers, T>;

export type BehaviorKey = keyof BehaviorHandlers;

export function hasBehavior(ui: FirebaseUI, key: BehaviorKey): boolean {
  return !!ui.get().behaviors[key];
}

export function getBehavior<T extends BehaviorKey>(ui: FirebaseUI, key: T): Behavior[T] {
  if (!hasBehavior(ui, key)) {
    throw new Error(`Behavior ${key} not found`);
  }

  return ui.get().behaviors[key] as Behavior[T];
}

export function autoAnonymousLogin(): Behavior<'autoAnonymousLogin'> {
  return {
    autoAnonymousLogin: async (auth) => {
      $state.set('signing-in');
      const user = await new Promise<User>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            signInAnonymously(auth);
            return;
          }

          unsubscribe();
          resolve(user);
        });
      });
      $state.set('idle');
      return user;
    },
  };
}

export function autoUpgradeAnonymousUsers(): Behavior<
  'autoUpgradeAnonymousCredential' | 'autoUpgradeAnonymousProvider' | 'autoUpgradeAnonymousLink'
> {
  return {
    autoUpgradeAnonymousCredential: async (auth, credential) => {
      const currentUser = auth.currentUser;

      // Check if the user is anonymous. If not, we can't upgrade them.
      if (!currentUser?.isAnonymous) {
        return;
      }

      $state.set('linking');
      const result = await linkWithCredential(currentUser, credential);
      $state.set('idle');
      return result;
    },
    autoUpgradeAnonymousProvider: async (auth, provider) => {
      const currentUser = auth.currentUser;

      if (!currentUser?.isAnonymous) {
        return;
      }

      $state.set('linking');
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
