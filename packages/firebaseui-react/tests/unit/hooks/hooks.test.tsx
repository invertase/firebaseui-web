import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUI, useAuth } from "../../../src/hooks";
import { getAuth } from "firebase/auth";
import { FirebaseUIContext } from "../../../src/context";

// Mock Firebase
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    /* other auth properties */
  })),
}));

describe("Hooks", () => {
  const mockApp = { name: "test-app" } as any;
  const mockTranslations = {
    en: {
      labels: {
        signIn: "Sign In",
        email: "Email",
      },
    },
  };

  const mockConfig = {
    app: mockApp,
    getAuth: vi.fn(),
    setLocale: vi.fn(),
    state: 'idle',
    setState: vi.fn(),
    locale: 'en',
    translations: mockTranslations,
    behaviors: {},
    recaptchaMode: 'normal',
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FirebaseUIContext.Provider value={mockConfig as any}>
      {children}
    </FirebaseUIContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useConfig", () => {
    it("returns the config from context", () => {
      const { result } = renderHook(() => useUI(), { wrapper });

      expect(result.current).toEqual(mockConfig);
    });
  });

  describe("useAuth", () => {
    it("returns the authentication instance from Firebase", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(getAuth).toHaveBeenCalledWith(mockApp);
      expect(result.current).toBeDefined();
    });
  });
});
