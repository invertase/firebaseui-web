import { vi } from "vitest";

// Define TranslationStrings type to match core package
export type TranslationStrings = Record<string, string>;

// Implement FirebaseUIError with the same interface as the real implementation
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

// Authentication functions
export const fuiSignInWithEmailAndPassword = vi.fn();
export const fuiSignInWithEmailLink = vi.fn();
export const fuiSignInWithPhone = vi.fn();
export const fuiSignInWithOAuth = vi.fn();
export const fuiResetPassword = vi.fn();
export const fuiCreateUserWithEmailAndPassword = vi.fn();

// Country data for phone authentication
export const countryData = [
  { code: "US", name: "United States", dialCode: "+1", emoji: "🇺🇸" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", emoji: "🇬🇧" },
  { code: "DE", name: "Germany", dialCode: "+49", emoji: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", emoji: "🇫🇷" },
  { code: "JP", name: "Japan", dialCode: "+81", emoji: "🇯🇵" },
];

// Translation helpers
export const getTranslation = vi.fn((section, key) => `${section}.${key}`);