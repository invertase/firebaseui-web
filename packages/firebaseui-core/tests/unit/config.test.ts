import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeUI, $config, getTranslations } from '../../src/config';
import { fuiSignInAnonymously } from '../../src/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { FUIConfig } from '../../src/types';
import { map } from 'nanostores';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn(() => () => {}),
}));

vi.mock('../../src/auth', () => ({
  fuiSignInAnonymously: vi.fn(),
}));

describe('Config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    $config.set({});
  });

  describe('initializeUI', () => {
    it('should initialize config with default name', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        enableAutoAnonymousLogin: false,
      };
      const store = initializeUI(config);
      expect(store.get()).toEqual(config);
      expect($config.get()['[DEFAULT]']).toBe(store);
    });

    it('should initialize config with custom name', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        enableAutoAnonymousLogin: false,
      };
      const store = initializeUI(config, 'custom');
      expect(store.get()).toEqual(config);
      expect($config.get()['custom']).toBe(store);
    });

    it('should setup auto anonymous login when enabled', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        enableAutoAnonymousLogin: true,
      };
      initializeUI(config);
      expect(onAuthStateChanged).toHaveBeenCalled();
      const callback = (onAuthStateChanged as any).mock.calls[0][1];
      callback(null);
      expect(fuiSignInAnonymously).toHaveBeenCalled();
    });

    it('should not setup auto anonymous login when disabled', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        enableAutoAnonymousLogin: false,
      };
      initializeUI(config);
      expect(onAuthStateChanged).not.toHaveBeenCalled();
    });
  });

  describe('getTranslations', () => {
    it('should return translations for default config', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        translations: {
          en: {
            errors: {
              invalidEmail: 'Test Error',
            },
          },
        },
      };
      const configStore = map<Record<string, FUIConfig>>({
        '[DEFAULT]': config,
      });
      const translations = getTranslations(configStore);
      expect(translations.get()).toEqual(config.translations);
    });

    it('should return translations for named config', () => {
      const mockApp = {
        name: 'test',
        options: {},
        automaticDataCollectionEnabled: false,
      } as FirebaseApp;
      const config: FUIConfig = {
        app: mockApp,
        translations: {
          en: {
            errors: {
              invalidEmail: 'Test Error',
            },
          },
        },
      };
      const configStore = map<Record<string, FUIConfig>>({
        custom: config,
      });
      const translations = getTranslations(configStore, 'custom');
      expect(translations.get()).toEqual(config.translations);
    });

    it('should return undefined for non-existent config', () => {
      const configStore = map<Record<string, FUIConfig>>({});
      const translations = getTranslations(configStore, 'non-existent');
      expect(translations.get()).toBeUndefined();
    });
  });
});
