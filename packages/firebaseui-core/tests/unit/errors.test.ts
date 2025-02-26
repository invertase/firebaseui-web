import { describe, it, expect, beforeEach } from 'vitest';
import { FirebaseUIError, handleFirebaseError } from '../../src/errors';

describe('FirebaseUIError', () => {
  describe('constructor', () => {
    it('should extract error code from Firebase error message', () => {
      const error = new FirebaseUIError({
        customData: { message: 'Firebase: Error (auth/user-not-found).' },
      });
      expect(error.code).toBe('auth/user-not-found');
    });

    it('should use error code directly if available', () => {
      const error = new FirebaseUIError({ code: 'auth/wrong-password' });
      expect(error.code).toBe('auth/wrong-password');
    });

    it('should fallback to unknown if no code is found', () => {
      const error = new FirebaseUIError({});
      expect(error.code).toBe('unknown');
    });

    it('should use custom translations if provided', () => {
      const error = new FirebaseUIError(
        { code: 'auth/user-not-found' },
        {
          es: {
            errors: {
              userNotFound: 'Usuario no encontrado',
            },
          },
        },
        'es'
      );
      expect(error.message).toBe('Usuario no encontrado');
    });

    it('should fallback to default translation if language is not found', () => {
      const error = new FirebaseUIError(
        { code: 'auth/user-not-found' },
        {
          en: {
            errors: {
              userNotFound: 'User not found',
            },
          },
        },
        'fr'
      );
      expect(error.message).toBe('User not found');
    });

    it('should handle malformed error objects gracefully', () => {
      const error = new FirebaseUIError(null);
      expect(error.code).toBe('unknown');
      expect(error.name).toBe('FirebaseUIError');
    });

    it('should set error name to FirebaseUIError', () => {
      const error = new FirebaseUIError({});
      expect(error.name).toBe('FirebaseUIError');
    });
  });
});

describe('handleFirebaseError', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should throw FirebaseUIError for Firebase errors', async () => {
    const firebaseError = {
      name: 'FirebaseError',
      code: 'auth/user-not-found',
    };

    await expect(handleFirebaseError(firebaseError)).rejects.toThrow(FirebaseUIError);
  });

  it('should throw FirebaseUIError with unknown code for non-Firebase errors', async () => {
    const error = new Error('Random error');

    await expect(handleFirebaseError(error)).rejects.toThrow(FirebaseUIError);
  });

  it('should pass translations and language to FirebaseUIError', async () => {
    const firebaseError = {
      name: 'FirebaseError',
      code: 'auth/user-not-found',
    };

    const translations = {
      es: {
        errors: {
          userNotFound: 'Usuario no encontrado',
        },
      },
    };

    try {
      await handleFirebaseError(firebaseError, { translations, language: 'es' });
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseUIError);
      expect(e.message).toBe('Usuario no encontrado');
    }
  });

  it('should handle null/undefined errors', async () => {
    await expect(handleFirebaseError(null)).rejects.toThrow(FirebaseUIError);
    await expect(handleFirebaseError(undefined)).rejects.toThrow(FirebaseUIError);
  });

  it('should preserve the error code in thrown error', async () => {
    const firebaseError = {
      name: 'FirebaseError',
      code: 'auth/wrong-password',
    };

    try {
      await handleFirebaseError(firebaseError);
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseUIError);
      expect(e.code).toBe('auth/wrong-password');
    }
  });

  describe('account exists with different credential handling', () => {
    beforeEach(() => {
      window.sessionStorage.clear();
    });

    it('should store credential and throw error when enableHandleExistingCredential is true', async () => {
      const existingCredentialError = {
        name: 'FirebaseError',
        code: 'auth/account-exists-with-different-credential',
        credential: { type: 'google.com', token: 'mock-token' },
        customData: {
          email: 'test@example.com',
        },
      };

      await expect(
        handleFirebaseError(existingCredentialError, { enableHandleExistingCredential: true })
      ).rejects.toThrow(FirebaseUIError);
      expect(window.sessionStorage.getItem('pendingCred')).toBe(JSON.stringify(existingCredentialError.credential));
    });

    it('should not store credential when enableHandleExistingCredential is false', async () => {
      const existingCredentialError = {
        name: 'FirebaseError',
        code: 'auth/account-exists-with-different-credential',
        credential: { type: 'google.com', token: 'mock-token' },
        customData: {
          email: 'test@example.com',
        },
      };

      await expect(handleFirebaseError(existingCredentialError)).rejects.toThrow(FirebaseUIError);
      expect(window.sessionStorage.getItem('pendingCred')).toBeNull();
    });

    it('should not store credential when no credential in error', async () => {
      const existingCredentialError = {
        name: 'FirebaseError',
        code: 'auth/account-exists-with-different-credential',
        customData: {
          email: 'test@example.com',
        },
      };

      await expect(
        handleFirebaseError(existingCredentialError, { enableHandleExistingCredential: true })
      ).rejects.toThrow(FirebaseUIError);
      expect(window.sessionStorage.getItem('pendingCred')).toBeNull();
    });

    it('should include email in error and use translations when provided', async () => {
      const existingCredentialError = {
        name: 'FirebaseError',
        code: 'auth/account-exists-with-different-credential',
        credential: { type: 'google.com', token: 'mock-token' },
        customData: {
          email: 'test@example.com',
        },
      };

      const translations = {
        es: {
          errors: {
            accountExistsWithDifferentCredential: 'La cuenta ya existe con otras credenciales',
          },
        },
      };

      try {
        await handleFirebaseError(existingCredentialError, {
          enableHandleExistingCredential: true,
          translations,
          language: 'es',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(FirebaseUIError);
        expect(e.code).toBe('auth/account-exists-with-different-credential');
        expect(e.message).toBe('La cuenta ya existe con otras credenciales');
      }
    });
  });
});
