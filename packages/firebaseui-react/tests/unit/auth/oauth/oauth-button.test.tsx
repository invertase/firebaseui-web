import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OAuthButton } from "../../../../src/auth/oauth/oauth-button";
import type { AuthProvider } from "firebase/auth";
import { fuiSignInWithOAuth, getTranslation } from "@firebase-ui/core";

// Create a mock provider that matches the AuthProvider interface
const mockGoogleProvider = { providerId: "google.com" } as AuthProvider;

// Mock React hooks from the package
const useAuthMock = vi.fn();
const useConfigMock = vi.fn();
const useTranslationsMock = vi.fn();

vi.mock("../../../../src/hooks", () => ({
  useAuth: () => useAuthMock(),
  useConfig: () => useConfigMock(),
  useTranslations: () => useTranslationsMock(),
}));

// Mock the Button component
vi.mock("../../../../src/components/button", () => ({
  Button: ({ children, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="oauth-button">
      {children}
    </button>
  ),
}));

describe("OAuthButton Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(fuiSignInWithOAuth).mockResolvedValue(undefined);

    useAuthMock.mockReturnValue({
      auth: {}, // Mock Firebase Auth instance
    });

    useConfigMock.mockReturnValue({
      language: "en",
      translations: {},
      enableAutoUpgradeAnonymous: false,
      enableHandleExistingCredential: false,
    });

    useTranslationsMock.mockReturnValue({});

    // Override getTranslation for specific cases
    vi.mocked(getTranslation).mockImplementation((section, key) => {
      if (section === "errors") {
        if (key === "unknownError") return "An unknown error occurred";
      }
      return `${section}.${key}`;
    });
  });

  it("renders a button with the provided children", () => {
    render(
      <OAuthButton provider={mockGoogleProvider}>
        Sign in with Google
      </OAuthButton>
    );

    const button = screen.getByTestId("oauth-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Sign in with Google");
  });

  it("calls fuiSignInWithOAuth when clicked", () => {
    render(
      <OAuthButton provider={mockGoogleProvider}>
        Sign in with Google
      </OAuthButton>
    );

    const button = screen.getByTestId("oauth-button");
    fireEvent.click(button);

    expect(fuiSignInWithOAuth).toHaveBeenCalledTimes(1);
    expect(fuiSignInWithOAuth).toHaveBeenCalledWith(
      expect.anything(),
      mockGoogleProvider,
      expect.objectContaining({
        language: "en",
        translations: {},
        enableAutoUpgradeAnonymous: false,
        enableHandleExistingCredential: false,
      })
    );
  });

  it("passes custom configuration options to fuiSignInWithOAuth", () => {
    // Set up custom translations
    const customTranslations = { custom: "translations" };

    // Update the config mock to include custom settings
    useConfigMock.mockReturnValue({
      language: "fr",
      enableAutoUpgradeAnonymous: true,
      enableHandleExistingCredential: true,
    });

    // Mock the useTranslations hook to return custom translations
    useTranslationsMock.mockReturnValue(customTranslations);

    render(
      <OAuthButton provider={mockGoogleProvider}>
        Sign in with Google
      </OAuthButton>
    );

    const button = screen.getByTestId("oauth-button");
    fireEvent.click(button);

    // Verify that the function is called with the correct parameters
    expect(fuiSignInWithOAuth).toHaveBeenCalledWith(
      expect.anything(),
      mockGoogleProvider,
      expect.objectContaining({
        language: "fr",
        translations: customTranslations,
        enableAutoUpgradeAnonymous: true,
        enableHandleExistingCredential: true,
      })
    );
  });

  it("displays error message when non-Firebase error occurs", async () => {
    // Mock console.error to prevent test output noise
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock a non-Firebase error to trigger console.error
    const regularError = new Error("Regular error");
    vi.mocked(fuiSignInWithOAuth).mockRejectedValueOnce(regularError);

    // Mock the getTranslation to return an error message
    vi.mocked(getTranslation).mockReturnValueOnce("An unknown error occurred");

    render(
      <OAuthButton provider={mockGoogleProvider}>
        Sign in with Google
      </OAuthButton>
    );

    const button = screen.getByTestId("oauth-button");

    // Click the button to trigger the error
    fireEvent.click(button);

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Verify console.error was called with the regular error
      expect(consoleErrorSpy).toHaveBeenCalledWith(regularError);

      // Verify the error message is displayed
      const errorMessage = screen.getByText("An unknown error occurred");
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveClass("fui-form__error");
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
