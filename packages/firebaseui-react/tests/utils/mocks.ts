import { vi } from "vitest";
import { render, type RenderOptions } from "@testing-library/react";
import React from "react";

// Mock types
export type TranslationStrings = Record<string, string>;

// Standard Firebase UI Error implementation for mocks
export class FirebaseUIError extends Error {
  code: string;
  constructor(
    error: any,
    _translations?: Partial<Record<string, Partial<TranslationStrings>>>,
    _language?: string
  ) {
    // Extract error code from the error object
    const errorCode =
      typeof error === "string" ? error : error?.code || "unknown";

    // For simplicity in tests, we'll use a direct message if provided as a string
    // or extract from translations if provided
    let errorMessage = `Error: ${errorCode}`;

    if (
      typeof error === "string" &&
      arguments.length > 1 &&
      typeof arguments[1] === "string"
    ) {
      // Handle case where first arg is code and second is message (for test convenience)
      errorMessage = arguments[1];
    }

    super(errorMessage);
    this.name = "FirebaseUIError";
    this.code = errorCode;
  }
}

// Backward compatibility for existing tests using MockFirebaseUIError
export const MockFirebaseUIError = FirebaseUIError;

// Common mock data
export const mockCountryData = [
  { code: "US", name: "United States", dialCode: "+1", emoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", emoji: "🇬🇧" },
  { code: "DE", name: "Germany", dialCode: "+49", emoji: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", emoji: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", emoji: "🇯🇵" },
];

// Mock function helpers
export const createMockTranslations = () => {
  return vi.fn((section: string, key: string) => `${section}.${key}`);
};

/**
 * Creates comprehensive mock implementations for Firebase UI core functions
 * This allows tests to selectively mock only what they need
 */
export const createCoreMocks = () => {
  return {
    fuiSignInWithEmailAndPassword: vi.fn(),
    fuiSignInWithEmailLink: vi.fn(),
    fuiSendSignInLinkToEmail: vi.fn(),
    fuiCompleteEmailLinkSignIn: vi.fn(),
    fuiSignInWithPhone: vi.fn(),
    fuiSignInWithOAuth: vi.fn().mockResolvedValue(undefined),
    fuiResetPassword: vi.fn(),
    fuiSendPasswordResetEmail: vi.fn(),
    fuiCreateUserWithEmailAndPassword: vi.fn(),
    getTranslation: createMockTranslations(),
    countryData: mockCountryData,
    populateTranslation: vi.fn((text, data) => {
      if (!data) return text;
      let result = text;
      Object.entries(data).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
      });
      return result;
    }),
    FirebaseUIError,
  };
};

/**
 * Set up mocks for @firebase-ui/core in a test file
 * This should be called in beforeEach or at the top of a test file
 *
 * @example
 * ```
 * import { setupFirebaseUICoresMocks } from '../utils/mocks';
 *
 * // At the top of your test file
 * const mocks = setupFirebaseUICoresMocks();
 *
 * // Now use the mock in your tests
 * mocks.fuiSignInWithOAuth.mockResolvedValueOnce({ user: {...} });
 * ```
 */
export function setupFirebaseUICoresMocks() {
  // Create and return the mock functions
  return createCoreMocks();
}

/**
 * Custom render function that includes providers if needed
 * Use this for tests that need to render components with context providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  }
) {
  return render(ui, options);
}
