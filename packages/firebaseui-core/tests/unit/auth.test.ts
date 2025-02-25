/// <reference lib="dom" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  Auth,
  EmailAuthProvider,
  PhoneAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithRedirect,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithCredential,
  signInWithPhoneNumber,
  signInWithRedirect,
} from 'firebase/auth';
import {
  fuiSignInWithEmailAndPassword,
  fuiCreateUserWithEmailAndPassword,
  fuiSignInWithPhoneNumber,
  fuiConfirmPhoneNumber,
  fuiSendPasswordResetEmail,
  fuiSendSignInLinkToEmail,
  fuiSignInWithEmailLink,
  fuiSignInAnonymously,
  fuiSignInWithOAuth,
  fuiCompleteEmailLinkSignIn,
} from '../../src/auth';
import { FirebaseUIError } from '../../src/errors';

// Mock all Firebase Auth functions
vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...(actual as object),
    getAuth: vi.fn(),
    signInWithCredential: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithPhoneNumber: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    sendSignInLinkToEmail: vi.fn(),
    isSignInWithEmailLink: vi.fn(),
    signInAnonymously: vi.fn(),
    linkWithCredential: vi.fn(),
    linkWithRedirect: vi.fn(),
    signInWithRedirect: vi.fn(),
    EmailAuthProvider: {
      credential: vi.fn(),
      credentialWithLink: vi.fn(),
    },
    PhoneAuthProvider: {
      credential: vi.fn(),
    },
  };
});

describe('Firebase UI Auth', () => {
  let mockAuth: Auth;

  const mockCredential = { type: 'password', token: 'mock-token' };
  const mockUserCredential = { user: { uid: 'mock-uid' } };
  const mockConfirmationResult = { verificationId: 'mock-verification-id' };
  const mockError = { name: 'FirebaseError', code: 'auth/user-not-found' };
  const mockProvider = { providerId: 'google.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth = { currentUser: null } as Auth;
    window.localStorage.clear();
    (EmailAuthProvider.credential as any).mockReturnValue(mockCredential);
    (EmailAuthProvider.credentialWithLink as any).mockReturnValue(mockCredential);
    (PhoneAuthProvider.credential as any).mockReturnValue(mockCredential);
  });

  describe('fuiSignInWithEmailAndPassword', () => {
    it('should sign in with email and password', async () => {
      (signInWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiSignInWithEmailAndPassword(mockAuth, 'test@test.com', 'password');

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith('test@test.com', 'password');
      expect(signInWithCredential).toHaveBeenCalledWith(mockAuth, mockCredential);
      expect(result).toBe(mockUserCredential);
    });

    it('should upgrade anonymous user when enabled', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      (linkWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiSignInWithEmailAndPassword(mockAuth, 'test@test.com', 'password', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(linkWithCredential).toHaveBeenCalledWith(mockAuth.currentUser, mockCredential);
      expect(result).toBe(mockUserCredential);
    });
  });

  describe('fuiCreateUserWithEmailAndPassword', () => {
    it('should create user with email and password', async () => {
      (createUserWithEmailAndPassword as any).mockResolvedValue(mockUserCredential);

      const result = await fuiCreateUserWithEmailAndPassword(mockAuth, 'test@test.com', 'password');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@test.com', 'password');
      expect(result).toBe(mockUserCredential);
    });

    it('should upgrade anonymous user when enabled', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      (linkWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiCreateUserWithEmailAndPassword(mockAuth, 'test@test.com', 'password', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(linkWithCredential).toHaveBeenCalledWith(mockAuth.currentUser, mockCredential);
      expect(result).toBe(mockUserCredential);
    });
  });

  describe('fuiSignInWithPhoneNumber', () => {
    it('should initiate phone number sign in', async () => {
      (signInWithPhoneNumber as any).mockResolvedValue(mockConfirmationResult);
      const mockRecaptcha = { type: 'recaptcha' };

      const result = await fuiSignInWithPhoneNumber(mockAuth, '+1234567890', mockRecaptcha as any);

      expect(signInWithPhoneNumber).toHaveBeenCalledWith(mockAuth, '+1234567890', mockRecaptcha);
      expect(result).toBe(mockConfirmationResult);
    });
  });

  describe('fuiConfirmPhoneNumber', () => {
    it('should confirm phone number sign in', async () => {
      (getAuth as any).mockReturnValue(mockAuth);
      (signInWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiConfirmPhoneNumber({ verificationId: 'mock-id' } as any, '123456');

      expect(PhoneAuthProvider.credential).toHaveBeenCalledWith('mock-id', '123456');
      expect(signInWithCredential).toHaveBeenCalledWith(mockAuth, mockCredential);
      expect(result).toBe(mockUserCredential);
    });

    it('should upgrade anonymous user when enabled', async () => {
      const mockAuthWithAnonymousUser = { currentUser: { isAnonymous: true } } as Auth;
      (getAuth as any).mockReturnValue(mockAuthWithAnonymousUser);
      (linkWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiConfirmPhoneNumber({ verificationId: 'mock-id' } as any, '123456', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(linkWithCredential).toHaveBeenCalled();
      expect(result).toBe(mockUserCredential);
    });
  });

  describe('fuiSendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      (sendPasswordResetEmail as any).mockResolvedValue(undefined);

      await fuiSendPasswordResetEmail(mockAuth, 'test@test.com');

      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, 'test@test.com');
    });
  });

  describe('fuiSendSignInLinkToEmail', () => {
    it('should send sign in link to email', async () => {
      (sendSignInLinkToEmail as any).mockResolvedValue(undefined);
      const expectedActionCodeSettings = {
        url: window.location.href,
        handleCodeInApp: true,
      };

      await fuiSendSignInLinkToEmail(mockAuth, 'test@test.com');

      expect(sendSignInLinkToEmail).toHaveBeenCalledWith(mockAuth, 'test@test.com', expectedActionCodeSettings);
      expect(window.localStorage.getItem('emailForSignIn')).toBe('test@test.com');
    });

    it('should handle anonymous upgrade flag', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      (sendSignInLinkToEmail as any).mockResolvedValue(undefined);

      await fuiSendSignInLinkToEmail(mockAuth, 'test@test.com', { enableAutoUpgradeAnonymous: true });

      expect(window.localStorage.getItem('emailLinkAnonymousUpgrade')).toBe('true');
    });
  });

  describe('fuiSignInWithEmailLink', () => {
    it('should sign in with email link', async () => {
      (signInWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiSignInWithEmailLink(mockAuth, 'test@test.com', 'mock-link');

      expect(EmailAuthProvider.credentialWithLink).toHaveBeenCalledWith('test@test.com', 'mock-link');
      expect(signInWithCredential).toHaveBeenCalledWith(mockAuth, mockCredential);
      expect(result).toBe(mockUserCredential);
    });

    it('should upgrade anonymous user when enabled', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
      (linkWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiSignInWithEmailLink(mockAuth, 'test@test.com', 'mock-link', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(linkWithCredential).toHaveBeenCalled();
      expect(result).toBe(mockUserCredential);
      expect(window.localStorage.getItem('emailLinkAnonymousUpgrade')).toBeNull();
    });
  });

  describe('fuiSignInAnonymously', () => {
    it('should sign in anonymously', async () => {
      (signInAnonymously as any).mockResolvedValue(mockUserCredential);

      const result = await fuiSignInAnonymously(mockAuth);

      expect(signInAnonymously).toHaveBeenCalledWith(mockAuth);
      expect(result).toBe(mockUserCredential);
    });

    it('should handle operation not allowed error', async () => {
      const operationNotAllowedError = { name: 'FirebaseError', code: 'auth/operation-not-allowed' };
      (signInAnonymously as any).mockRejectedValue(operationNotAllowedError);

      await expect(fuiSignInAnonymously(mockAuth)).rejects.toThrow();
    });

    it('should handle admin restricted operation error', async () => {
      const adminRestrictedError = { name: 'FirebaseError', code: 'auth/admin-restricted-operation' };
      (signInAnonymously as any).mockRejectedValue(adminRestrictedError);

      await expect(fuiSignInAnonymously(mockAuth)).rejects.toThrow();
    });
  });

  describe('Anonymous User Upgrade', () => {
    it('should handle upgrade with existing email', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      const emailExistsError = { name: 'FirebaseError', code: 'auth/email-already-in-use' };
      (linkWithCredential as any).mockRejectedValue(emailExistsError);

      await expect(
        fuiCreateUserWithEmailAndPassword(mockAuth, 'existing@test.com', 'password', {
          enableAutoUpgradeAnonymous: true,
        })
      ).rejects.toThrow();
    });

    it('should handle upgrade of non-anonymous user', async () => {
      mockAuth = { currentUser: { isAnonymous: false } } as Auth;

      const result = await fuiCreateUserWithEmailAndPassword(mockAuth, 'test@test.com', 'password', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(linkWithCredential).not.toHaveBeenCalled();
    });

    it('should handle null user during upgrade', async () => {
      mockAuth = { currentUser: null } as Auth;

      const result = await fuiCreateUserWithEmailAndPassword(mockAuth, 'test@test.com', 'password', {
        enableAutoUpgradeAnonymous: true,
      });

      expect(createUserWithEmailAndPassword).toHaveBeenCalled();
      expect(linkWithCredential).not.toHaveBeenCalled();
    });
  });

  describe('fuiSignInWithOAuth', () => {
    it('should sign in with OAuth provider', async () => {
      (signInWithRedirect as any).mockResolvedValue(undefined);

      await fuiSignInWithOAuth(mockAuth, mockProvider as any);

      expect(signInWithRedirect).toHaveBeenCalledWith(mockAuth, mockProvider);
    });

    it('should upgrade anonymous user when enabled', async () => {
      mockAuth = { currentUser: { isAnonymous: true } } as Auth;
      (linkWithRedirect as any).mockResolvedValue(undefined);

      await fuiSignInWithOAuth(mockAuth, mockProvider as any, { enableAutoUpgradeAnonymous: true });

      expect(linkWithRedirect).toHaveBeenCalledWith(mockAuth.currentUser, mockProvider);
    });
  });

  describe('fuiCompleteEmailLinkSignIn', () => {
    it('should complete email link sign in when valid', async () => {
      (isSignInWithEmailLink as any).mockReturnValue(true);
      window.localStorage.setItem('emailForSignIn', 'test@test.com');
      (signInWithCredential as any).mockResolvedValue(mockUserCredential);

      const result = await fuiCompleteEmailLinkSignIn(mockAuth, 'mock-url');

      expect(result).toBe(mockUserCredential);
      expect(window.localStorage.getItem('emailForSignIn')).toBeNull();
    });

    it('should clean up all storage items after sign in attempt', async () => {
      (isSignInWithEmailLink as any).mockReturnValue(true);
      window.localStorage.setItem('emailForSignIn', 'test@test.com');
      window.localStorage.setItem('emailLinkAnonymousUpgrade', 'true');
      (signInWithCredential as any).mockResolvedValue(mockUserCredential);

      await fuiCompleteEmailLinkSignIn(mockAuth, 'mock-url');

      expect(window.localStorage.getItem('emailForSignIn')).toBeNull();
      expect(window.localStorage.getItem('emailLinkAnonymousUpgrade')).toBeNull();
    });

    it('should return null when not a valid sign in link', async () => {
      (isSignInWithEmailLink as any).mockReturnValue(false);

      const result = await fuiCompleteEmailLinkSignIn(mockAuth, 'mock-url');

      expect(result).toBeNull();
    });

    it('should return null when no email in storage', async () => {
      (isSignInWithEmailLink as any).mockReturnValue(true);

      const result = await fuiCompleteEmailLinkSignIn(mockAuth, 'mock-url');

      expect(result).toBeNull();
    });
  });
});
