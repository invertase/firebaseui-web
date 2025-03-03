import { vi } from "vitest";

// Mock types
export type TranslationStrings = Record<string, string>;

// Mock class for FirebaseUIError
export class MockFirebaseUIError extends Error {
  code: string;
  constructor(code: string, message: string | any) {
    const errorMessage =
      typeof message === "string" ? message : `Error: ${code}`;
    super(errorMessage);
    this.code = code;
  }
}

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

export const createMockSignInWithOAuth = () => {
  return vi.fn().mockResolvedValue(undefined);
};

/**
 * Set up mocks for @firebase-ui/core in a test file
 * This should be called in beforeEach or at the top of a test file
 */
export function setupFirebaseUICoresMocks() {
  // Create the mock functions
  const mockGetTranslation = createMockTranslations();
  const mockFuiSignInWithOAuth = createMockSignInWithOAuth();

  // Set up the mock for the module
  vi.mock("@firebase-ui/core", () => ({
    FirebaseUIError: MockFirebaseUIError,
    fuiSignInWithOAuth: mockFuiSignInWithOAuth,
    getTranslation: mockGetTranslation,
    countryData: mockCountryData,
    populateTranslation: vi.fn((text, data) => {
      if (!data) return text;
      let result = text;
      Object.entries(data).forEach(([key, value]) => {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
      });
      return result;
    }),
  }));

  return {
    mockGetTranslation,
    mockFuiSignInWithOAuth,
  };
}
