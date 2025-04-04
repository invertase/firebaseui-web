import { describe, it, expect, vi } from 'vitest';
import { initializeUI, $config } from '../../src/config';
import { english } from '@firebase-ui/translations';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('Config', () => {
  describe('initializeUI', () => {
    it('should initialize config with default name', () => {
      const config = {
        app: {
          name: 'test',
          options: {},
          automaticDataCollectionEnabled: false,
        },
      };

      const store = initializeUI(config);
      expect(store.get()).toEqual({
        app: config.app,
        getAuth: expect.any(Function),
        locale: 'en-US',
        setLocale: expect.any(Function),
        state: 'idle',
        setState: expect.any(Function),
        translations: {
          'en-US': english.translations,
        },
        behaviors: {},
        recaptchaMode: 'normal',
      });
      expect($config.get()['[DEFAULT]']).toBe(store);
    });

    it('should initialize config with custom name', () => {
      const config = {
        app: {
          name: 'test',
          options: {},
          automaticDataCollectionEnabled: false,
        },
      };

      const store = initializeUI(config, 'custom');
      expect(store.get()).toEqual({
        app: config.app,
        getAuth: expect.any(Function),
        locale: 'en-US',
        setLocale: expect.any(Function),
        state: 'idle',
        setState: expect.any(Function),
        translations: {
          'en-US': english.translations,
        },
        behaviors: {},
        recaptchaMode: 'normal',
      });
      expect($config.get()['custom']).toBe(store);
    });

    it('should setup auto anonymous login when enabled', () => {
      const config = {
        app: {
          name: 'test',
          options: {},
          automaticDataCollectionEnabled: false,
        },
        behaviors: [
          {
            autoAnonymousLogin: vi.fn().mockImplementation(async (ui) => {
              ui.setState('idle');
              return {};
            }),
          },
        ],
      };

      const store = initializeUI(config);
      expect(store.get().behaviors.autoAnonymousLogin).toBeDefined();
      expect(store.get().behaviors.autoAnonymousLogin).toHaveBeenCalled();
      expect(store.get().state).toBe('idle');
    });

    it('should not setup auto anonymous login when disabled', () => {
      const config = {
        app: {
          name: 'test',
          options: {},
          automaticDataCollectionEnabled: false,
        },
      };

      const store = initializeUI(config);
      expect(store.get().behaviors.autoAnonymousLogin).toBeUndefined();
    });

    it('should handle both auto features being enabled', () => {
      const config = {
        app: {
          name: 'test',
          options: {},
          automaticDataCollectionEnabled: false,
        },
        behaviors: [
          {
            autoAnonymousLogin: vi.fn().mockImplementation(async (ui) => {
              ui.setState('idle');
              return {};
            }),
            autoUpgradeAnonymousCredential: vi.fn(),
          },
        ],
      };

      const store = initializeUI(config);
      expect(store.get()).toEqual({
        app: config.app,
        getAuth: expect.any(Function),
        locale: 'en-US',
        setLocale: expect.any(Function),
        state: 'idle',
        setState: expect.any(Function),
        translations: {
          'en-US': english.translations,
        },
        behaviors: {
          autoAnonymousLogin: expect.any(Function),
          autoUpgradeAnonymousCredential: expect.any(Function),
        },
        recaptchaMode: 'normal',
      });
      expect(store.get().behaviors.autoAnonymousLogin).toHaveBeenCalled();
    });
  });
});
