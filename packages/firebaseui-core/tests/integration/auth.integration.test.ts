import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth, signOut, deleteUser } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  fuiSignInWithEmailAndPassword,
  fuiCreateUserWithEmailAndPassword,
  fuiSendSignInLinkToEmail,
  fuiSignInAnonymously,
  fuiSendPasswordResetEmail,
  fuiSignInWithOAuth,
  fuiCompleteEmailLinkSignIn,
  fuiConfirmPhoneNumber,
} from '../../src/auth';
import { FirebaseUIError } from '../../src/errors';

describe('Firebase UI Auth Integration', () => {
  let auth: Auth;
  const testPassword = 'testPassword123!';
  let testCount = 0;

  const getUniqueEmail = () => `test${Date.now()}-${testCount++}@example.com`;

  beforeAll(() => {
    const app = initializeApp({
      apiKey: 'fake-api-key',
      authDomain: 'fake-auth-domain',
      projectId: 'fake-project-id',
    });
    auth = getAuth(app);
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  });

  beforeEach(async () => {
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch {}
      await signOut(auth);
    }
    window.localStorage.clear();
    testCount = 0;
  });

  afterEach(async () => {
    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch {}
      await signOut(auth);
    }
    window.localStorage.clear();
  });

  describe('Email/Password Authentication', () => {
    it('should create a new user and sign in', async () => {
      const email = getUniqueEmail();

      const createResult = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword);
      expect(createResult.user).toBeDefined();
      expect(createResult.user.email).toBe(email);

      await signOut(auth);

      const signInResult = await fuiSignInWithEmailAndPassword(auth, email, testPassword);
      expect(signInResult.user).toBeDefined();
      expect(signInResult.user.email).toBe(email);
    });

    it('should fail with invalid credentials', async () => {
      const email = getUniqueEmail();
      await expect(fuiSignInWithEmailAndPassword(auth, email, 'wrongpassword')).rejects.toThrow();
    });

    it('should handle password reset email', async () => {
      const email = getUniqueEmail();
      await fuiCreateUserWithEmailAndPassword(auth, email, testPassword);
      await signOut(auth);

      await expect(fuiSendPasswordResetEmail(auth, email)).resolves.not.toThrow();
    });
  });

  describe('Anonymous Authentication', () => {
    it('should sign in anonymously', async () => {
      const result = await fuiSignInAnonymously(auth);
      expect(result.user).toBeDefined();
      expect(result.user.isAnonymous).toBe(true);
    });

    it('should upgrade anonymous user to email/password', async () => {
      const email = getUniqueEmail();

      await fuiSignInAnonymously(auth);

      const result = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword, {
        enableAutoUpgradeAnonymous: true,
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.isAnonymous).toBe(false);
    });
  });

  describe('Email Link Authentication', () => {
    it('should manage email storage for email link sign in', async () => {
      const email = getUniqueEmail();

      // Should store email
      await fuiSendSignInLinkToEmail(auth, email);
      expect(window.localStorage.getItem('emailForSignIn')).toBe(email);

      // Should store anonymous upgrade flag - first sign in anonymously
      await fuiSignInAnonymously(auth);
      await fuiSendSignInLinkToEmail(auth, email, { enableAutoUpgradeAnonymous: true });
      expect(window.localStorage.getItem('emailLinkAnonymousUpgrade')).toBe('true');

      // Should clean up storage after sign in attempt
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
      await fuiSendSignInLinkToEmail(auth, email);
      expect(window.localStorage.getItem('emailForSignIn')).toBe(email);
      expect(window.localStorage.getItem('emailLinkAnonymousUpgrade')).toBe(null);
    });
  });

  describe('OAuth Authentication', () => {
    it.skip('should handle enableAutoUpgradeAnonymous flag for OAuth (skipped - requires user interaction)', async () => {
      await fuiSignInAnonymously(auth);
      const provider = new GoogleAuthProvider();
      await fuiSignInWithOAuth(auth, provider, { enableAutoUpgradeAnonymous: true });
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate email registration', async () => {
      const email = getUniqueEmail();
      await fuiCreateUserWithEmailAndPassword(auth, email, testPassword);
      await signOut(auth);

      await expect(fuiCreateUserWithEmailAndPassword(auth, email, testPassword)).rejects.toThrow();
    });

    it('should handle non-existent user sign in', async () => {
      const email = getUniqueEmail();
      await expect(fuiSignInWithEmailAndPassword(auth, email, 'password')).rejects.toThrow();
    });

    it('should handle invalid email formats', async () => {
      const invalidEmails = [
        'invalid', // No @ symbol
        '@', // Just @ symbol
        '@domain', // No local part
        'user@', // No domain
      ];

      for (const email of invalidEmails) {
        await expect(fuiCreateUserWithEmailAndPassword(auth, email, testPassword)).rejects.toThrow();
      }
    });

    it('should handle multiple anonymous account upgrades', async () => {
      const email = getUniqueEmail();

      await fuiSignInAnonymously(auth);
      const result1 = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword, {
        enableAutoUpgradeAnonymous: true,
      });
      expect(result1.user.isAnonymous).toBe(false);

      await signOut(auth);
      await fuiSignInAnonymously(auth);

      const email2 = getUniqueEmail();
      const result2 = await fuiCreateUserWithEmailAndPassword(auth, email2, testPassword, {
        enableAutoUpgradeAnonymous: true,
      });
      expect(result2.user.isAnonymous).toBe(false);
      expect(result2.user.uid).not.toBe(result1.user.uid);
    });

    it('should handle special characters in email', async () => {
      const email = `test.name+${Date.now()}@example.com`;
      const result = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword);
      expect(result.user.email).toBe(email);
    });

    it('should handle concurrent sign-in attempts', async () => {
      const email = getUniqueEmail();
      await fuiCreateUserWithEmailAndPassword(auth, email, testPassword);
      await signOut(auth);

      const attempts = Array(3)
        .fill(null)
        .map(() => fuiSignInWithEmailAndPassword(auth, email, testPassword));

      const results = await Promise.all(attempts);
      expect(results.every((result) => result.user.email === email)).toBe(true);
    });
  });

  describe('Anonymous User Upgrade', () => {
    it('should maintain user data when upgrading anonymous account', async () => {
      // First create an anonymous user
      const anonResult = await fuiSignInAnonymously(auth);
      const anonUid = anonResult.user.uid;

      // Upgrade to email/password
      const email = getUniqueEmail();
      const result = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword, {
        enableAutoUpgradeAnonymous: true,
      });

      // Verify it's the same user
      expect(result.user.uid).toBe(anonUid);
      expect(result.user.email).toBe(email);
      expect(result.user.isAnonymous).toBe(false);
    });

    it('should handle enableAutoUpgradeAnonymous flag correctly', async () => {
      // Create an anonymous user
      await fuiSignInAnonymously(auth);
      const email = getUniqueEmail();

      // Try to create new user without upgrade flag
      const result = await fuiCreateUserWithEmailAndPassword(auth, email, testPassword, {
        enableAutoUpgradeAnonymous: false,
      });

      // Should be a new user, not an upgrade
      expect(result.user.isAnonymous).toBe(false);
      expect(result.user.email).toBe(email);
    });
  });

  describe('Email Link Authentication State Management', () => {
    it('should handle multiple email link requests properly', async () => {
      const email1 = getUniqueEmail();
      const email2 = getUniqueEmail();

      // First email link request
      await fuiSendSignInLinkToEmail(auth, email1);
      expect(window.localStorage.getItem('emailForSignIn')).toBe(email1);

      // Second email link request should override the first
      await fuiSendSignInLinkToEmail(auth, email2);
      expect(window.localStorage.getItem('emailForSignIn')).toBe(email2);
    });
  });
});
