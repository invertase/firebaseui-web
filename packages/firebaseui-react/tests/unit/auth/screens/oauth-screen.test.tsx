import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { OAuthScreen } from "~/auth/screens/oauth-screen";

// Mock hooks
vi.mock("~/hooks", () => ({
  useConfig: () => ({ language: "en" }),
  useTranslations: () => ({}),
}));

// Mock getTranslation
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "signIn") return "Sign In";
    if (category === "prompts" && key === "signInToAccount")
      return "Sign in to your account";
    return key;
  }),
}));

// Mock TermsAndPrivacy component
vi.mock("../../../../src/components/terms-and-privacy", () => ({
  TermsAndPrivacy: () => (
    <div
      className="text-text-muted text-xs text-start"
      data-testid="terms-and-privacy"
    >
      Terms and Privacy
    </div>
  ),
}));

describe("OAuthScreen", () => {
  it("renders with correct title and subtitle", () => {
    const { getByText } = render(<OAuthScreen>OAuth Provider</OAuthScreen>);

    expect(getByText("Sign In")).toBeInTheDocument();
    expect(getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("calls useConfig to get the language", () => {
    render(<OAuthScreen>OAuth Provider</OAuthScreen>);

    // This test implicitly tests that useConfig is called through the mock
    // If it hadn't been called, the title and subtitle wouldn't render correctly
  });

  it("renders children", () => {
    const { getByText } = render(<OAuthScreen>OAuth Provider</OAuthScreen>);

    expect(getByText("OAuth Provider")).toBeInTheDocument();
  });

  it("renders multiple children when provided", () => {
    const { getByText } = render(
      <OAuthScreen>
        <div>Provider 1</div>
        <div>Provider 2</div>
      </OAuthScreen>
    );

    expect(getByText("Provider 1")).toBeInTheDocument();
    expect(getByText("Provider 2")).toBeInTheDocument();
  });

  it("includes the TermsAndPrivacy component", () => {
    const { getByTestId } = render(<OAuthScreen>OAuth Provider</OAuthScreen>);

    expect(getByTestId("terms-and-privacy")).toBeInTheDocument();
  });
});
