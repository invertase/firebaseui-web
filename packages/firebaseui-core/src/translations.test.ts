import { describe, it, expect } from 'vitest';
import { getTranslation, type TranslationsConfig } from './translations';

describe('getTranslation', () => {
  it('should return default English translation when no custom translations provided', () => {
    const translation = getTranslation('errors', 'userNotFound');
    expect(translation).toBe('No account found with this email address');
  });

  it('should use custom translation when provided', () => {
    const customTranslations: TranslationsConfig = {
      en: {
        errors: {
          userNotFound: 'Custom error message',
        },
      },
    };

    const translation = getTranslation('errors', 'userNotFound', customTranslations);
    expect(translation).toBe('Custom error message');
  });

  it('should use custom translation in specified language', () => {
    const customTranslations: TranslationsConfig = {
      es: {
        errors: {
          userNotFound: 'Usuario no encontrado',
        },
      },
    };

    const translation = getTranslation('errors', 'userNotFound', customTranslations, 'es');
    expect(translation).toBe('Usuario no encontrado');
  });

  it('should fallback to English when specified language is not available', () => {
    const customTranslations: TranslationsConfig = {
      en: {
        errors: {
          userNotFound: 'Custom English message',
        },
      },
    };

    const translation = getTranslation('errors', 'userNotFound', customTranslations, 'fr');
    expect(translation).toBe('Custom English message');
  });

  it('should fallback to default English when no custom translations match', () => {
    const customTranslations: TranslationsConfig = {
      es: {
        errors: {
          wrongPassword: 'Contraseña incorrecta',
        },
      },
    };

    const translation = getTranslation('errors', 'userNotFound', customTranslations, 'es');
    expect(translation).toBe('No account found with this email address');
  });

  it('should work with different translation categories', () => {
    const translation = getTranslation('messages', 'passwordResetEmailSent');
    expect(translation).toBe('Password reset email sent successfully');
  });

  it('should handle partial custom translations', () => {
    const customTranslations: TranslationsConfig = {
      en: {
        errors: {
          // Only override one error message
          userNotFound: 'Custom not found message',
        },
      },
    };

    const userNotFound = getTranslation('errors', 'userNotFound', customTranslations);
    const wrongPassword = getTranslation('errors', 'wrongPassword', customTranslations);

    expect(userNotFound).toBe('Custom not found message');
    expect(wrongPassword).toBe('Incorrect password');
  });

  it('should handle empty custom translations object', () => {
    const customTranslations: TranslationsConfig = {};
    const translation = getTranslation('errors', 'userNotFound', customTranslations);
    expect(translation).toBe('No account found with this email address');
  });

  it('should handle undefined custom translations', () => {
    const translation = getTranslation('errors', 'userNotFound', undefined);
    expect(translation).toBe('No account found with this email address');
  });
});
