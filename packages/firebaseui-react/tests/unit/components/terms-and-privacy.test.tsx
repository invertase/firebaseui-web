import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Policies, PolicyProvider } from "../../../src/components/policies";

// Mock useUI hook
vi.mock("~/hooks", () => ({
  useUI: vi.fn(() => ({
    locale: "en-US",
    translations: {
      "en-US": {
        labels: {
          termsOfService: "Terms of Service",
          privacyPolicy: "Privacy Policy",
        },
        messages: {
          termsAndPrivacy: "By continuing, you agree to our {tos} and {privacy}",
        },
      },
    },
  })),
}));

describe("TermsAndPrivacy Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders component with terms and privacy links", () => {
    render(
      <PolicyProvider
        policies={{
          termsOfServiceUrl: "https://example.com/terms",
          privacyPolicyUrl: "https://example.com/privacy",
        }}
      >
        <Policies></Policies>
      </PolicyProvider>
    );

    // Check that the text and links are rendered
    expect(
      screen.getByText(/By continuing, you agree to our/)
    ).toBeInTheDocument();

    const tosLink = screen.getByText("Terms of Service");
    expect(tosLink).toBeInTheDocument();
    expect(tosLink.tagName).toBe("A");
    expect(tosLink).toHaveAttribute("target", "_blank");
    expect(tosLink).toHaveAttribute("rel", "noopener noreferrer");

    const privacyLink = screen.getByText("Privacy Policy");
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink.tagName).toBe("A");
    expect(privacyLink).toHaveAttribute("target", "_blank");
    expect(privacyLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("returns null when both tosUrl and privacyPolicyUrl are not provided", () => {
    const { container } = render(
      <PolicyProvider policies={undefined}>
        <Policies></Policies>
      </PolicyProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
