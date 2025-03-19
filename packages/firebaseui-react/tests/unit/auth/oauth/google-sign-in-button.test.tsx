import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GoogleSignInButton } from "~/auth/oauth/google-sign-in-button";

// Mock hooks
vi.mock("~/hooks", () => ({
  useConfig: () => ({ language: "en" }),
  useTranslations: () => ({}),
}));

// Mock getTranslation
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "signInWithGoogle")
      return "Sign in with Google";
    return key;
  }),
}));

// Mock the OAuthButton component
vi.mock("~/auth/oauth/oauth-button", () => ({
  OAuthButton: ({
    children,
    provider,
  }: {
    children: React.ReactNode;
    provider: any;
  }) => (
    <div data-testid="oauth-button" data-provider={provider.constructor.name}>
      {children}
    </div>
  ),
}));

// Mock the GoogleAuthProvider
vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: class GoogleAuthProvider {
    constructor() {
      // Empty constructor
    }
  },
}));

describe("GoogleSignInButton", () => {
  it("renders with the correct provider", () => {
    render(<GoogleSignInButton />);
    expect(screen.getByTestId("oauth-button")).toHaveAttribute(
      "data-provider",
      "GoogleAuthProvider"
    );
  });

  it("renders with the Google icon SVG", () => {
    render(<GoogleSignInButton />);
    const svg = document.querySelector(".fui-provider__icon");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("fui-provider__icon");
  });

  it("renders with the correct text", () => {
    render(<GoogleSignInButton />);
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });
});
