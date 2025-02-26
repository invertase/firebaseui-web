import { describe, it, expect } from 'vitest';
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
  it('should throw FirebaseUIError for Firebase errors', () => {
    const firebaseError = {
      name: 'FirebaseError',
      code: 'auth/user-not-found',
    };

    expect(() => handleFirebaseError(firebaseError)).toThrow(FirebaseUIError);
  });

  it('should throw FirebaseUIError with unknown code for non-Firebase errors', () => {
    const error = new Error('Random error');

    try {
      handleFirebaseError(error);
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseUIError);
      expect(e.code).toBe('unknown');
    }
  });

  it('should pass translations to FirebaseUIError', () => {
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
      handleFirebaseError(firebaseError, translations, 'es');
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseUIError);
      expect(e.message).toBe('Usuario no encontrado');
    }
  });

  it('should handle null/undefined errors', () => {
    expect(() => handleFirebaseError(null)).toThrow(FirebaseUIError);
    expect(() => handleFirebaseError(undefined)).toThrow(FirebaseUIError);
  });

  it('should preserve the error code in thrown error', () => {
    const firebaseError = {
      name: 'FirebaseError',
      code: 'auth/wrong-password',
    };

    try {
      handleFirebaseError(firebaseError);
    } catch (e) {
      expect(e).toBeInstanceOf(FirebaseUIError);
      expect(e.code).toBe('auth/wrong-password');
    }
  });
});
