import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useConfig, useAuth, useTranslations } from "../../../src/hooks";
import { getAuth } from "firebase/auth";
import { ConfigContext } from "../../../src/context/config-context";

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
    language: "en",
    translations: mockTranslations,
    tosUrl: "https://example.com/terms",
    privacyPolicyUrl: "https://example.com/privacy",
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ConfigContext.Provider value={mockConfig}>
      {children}
    </ConfigContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useConfig", () => {
    it("returns the config from context", () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

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

  describe("useTranslations", () => {
    it("returns the translations from the config", () => {
      const { result } = renderHook(() => useTranslations(), { wrapper });

      expect(result.current).toEqual(mockTranslations);
    });
  });
});
