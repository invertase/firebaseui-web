import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TermsAndPrivacy } from "../../../src/components/terms-and-privacy";
import { FirebaseUIConfiguration, getTranslation } from "@firebase-ui/core";

// Mock useConfig hook
const useConfigMock = vi.fn();
vi.mock("../../../src/hooks", () => ({
  useConfig: () => useConfigMock(),
}));

describe("TermsAndPrivacy Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    useConfigMock.mockReturnValue({
      tosUrl: "https://example.com/terms",
      privacyPolicyUrl: "https://example.com/privacy",
      translations: {},
      language: "en",
    });

    // Override getTranslation for specific cases
    vi.mocked(getTranslation).mockImplementation(
      (ui: FirebaseUIConfiguration, section: string, key: string) => {
        if (section === "labels" && key === "termsOfService") {
          return "Terms of Service";
        }
        if (section === "labels" && key === "privacyPolicy") {
          return "Privacy Policy";
        }
        if (section === "messages" && key === "termsAndPrivacy") {
          return "By continuing, you agree to our {tos} and {privacy}";
        }
        return `${section}.${key}`;
      }
    );
  });

  it("renders component with terms and privacy links", () => {
    render(
      <TermsAndPrivacy
        tosUrl="https://example.com/terms"
        privacyPolicyUrl="https://example.com/privacy"
      />
    );

    // Check that the text and links are rendered
    expect(
      screen.getByText(/By continuing, you agree to our/)
    ).toBeInTheDocument();

    const tosLink = screen.getByText("Terms of Service");
    expect(tosLink).toBeInTheDocument();
    expect(tosLink.tagName).toBe("A");
    expect(tosLink).toHaveAttribute("href", "https://example.com/terms");
    expect(tosLink).toHaveAttribute("target", "_blank");
    expect(tosLink).toHaveAttribute("rel", "noopener noreferrer");

    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.tagName).toBe("A");
    expect(privacyLink).toHaveAttribute("href", "https://example.com/privacy");
    expect(privacyLink).toHaveAttribute("target", "_blank");
    expect(privacyLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("returns null when both tosUrl and privacyPolicyUrl are not provided", () => {
    // Mock the useConfig to return no URLs
    useConfigMock.mockReturnValue({
      translations: {},
      language: "en",
    });

    const { container } = render(
      <TermsAndPrivacy tosUrl={undefined} privacyPolicyUrl={undefined} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders with tosUrl when privacyPolicyUrl is not provided", () => {
    // Mock the useConfig to return only tosUrl
    useConfigMock.mockReturnValue({
      tosUrl: "https://example.com/terms",
      privacyPolicyUrl: undefined,
      translations: {},
      language: "en",
    });

    render(
      <TermsAndPrivacy
        tosUrl="https://example.com/terms"
        privacyPolicyUrl={undefined}
      />
    );

    // Terms of Service link should be present
    const tosLink = screen.getByText("Terms of Service");
    expect(tosLink).toBeInTheDocument();
    expect(tosLink).toHaveAttribute("href", "https://example.com/terms");

    // Check that privacy placeholder is in the document
    expect(screen.getByText(/\{privacy\}/)).toBeInTheDocument();
  });

  it("renders with privacyPolicyUrl when tosUrl is not provided", () => {
    // Mock the useConfig to return only privacyPolicyUrl
    useConfigMock.mockReturnValue({
      tosUrl: undefined,
      privacyPolicyUrl: "https://example.com/privacy",
      translations: {},
      language: "en",
    });

    render(
      <TermsAndPrivacy
        tosUrl={undefined}
        privacyPolicyUrl="https://example.com/privacy"
      />
    );

    // Privacy Policy link should be present
    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute("href", "https://example.com/privacy");

    // Check that tos placeholder is in the document
    expect(screen.getByText(/\{tos\}/)).toBeInTheDocument();
  });

  it("uses custom template text when provided", () => {
    // Set up a custom template for this test
    vi.mocked(getTranslation).mockImplementation(
      (ui: FirebaseUIConfiguration, section: string, key: string) => {
        if (section === "labels" && key === "termsOfService") {
          return "Terms of Service";
        }
        if (section === "labels" && key === "privacyPolicy") {
          return "Privacy Policy";
        }
        if (section === "messages" && key === "termsAndPrivacy") {
          return "Custom template with {tos} and {privacy}";
        }
        return `${section}.${key}`;
      }
    );

    render(
      <TermsAndPrivacy
        tosUrl="https://example.com/terms"
        privacyPolicyUrl="https://example.com/privacy"
      />
    );

    expect(screen.getByText(/Custom template with/)).toBeInTheDocument();
    // Search for partial text since the text might be split across elements
    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
  });
});
