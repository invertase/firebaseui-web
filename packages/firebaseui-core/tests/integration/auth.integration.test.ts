import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth, signOut, deleteUser } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  fuiSignInWithEmailAndPassword,
  fuiCreateUserWithEmailAndPassword,
  fuiSignInWithEmailLink,
  fuiSendSignInLinkToEmail,
  fuiSignInAnonymously,
  fuiSendPasswordResetEmail,
  fuiSignInWithOAuth,
} from '../../src/auth';

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
    it('should initiate email link sign in', async () => {
      const email = getUniqueEmail();
      await expect(fuiSendSignInLinkToEmail(auth, email)).resolves.not.toThrow();

      expect(window.localStorage.getItem('emailForSignIn')).toBe(email);
    });

    // Note: Full email link sign-in flow can't be tested in integration tests
    // as it requires clicking the email link
  });

  describe('OAuth Authentication', () => {
    it.skip('should initiate OAuth sign in (skipped - requires user interaction)', async () => {
      const provider = new GoogleAuthProvider();
      await fuiSignInWithOAuth(auth, provider);
    });

    it.skip('should handle OAuth for anonymous upgrade (skipped - requires user interaction)', async () => {
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

    // Note: Firebase Auth has lenient email validation.
    // We test only definitely invalid email formats here.
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

    it('should handle password requirements', async () => {
      const email = getUniqueEmail();
      const weakPasswords = ['', '123', 'short'];

      for (const password of weakPasswords) {
        await expect(fuiCreateUserWithEmailAndPassword(auth, email, password)).rejects.toThrow();
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
});
