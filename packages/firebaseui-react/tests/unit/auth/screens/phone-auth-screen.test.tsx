import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { PhoneAuthScreen } from "~/auth/screens/phone-auth-screen";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useConfig: () => ({ language: "en" }),
  useTranslations: () => ({}),
}));

// Mock the translation function
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "signIn") return "Sign in";
    if (category === "prompts" && key === "signInToAccount")
      return "Sign in to your account";
    if (category === "messages" && key === "dividerOr") return "OR";
    return key;
  }),
}));

// Mock the PhoneForm component
vi.mock("~/auth/forms/phone-form", () => ({
  PhoneForm: ({ resendDelay }: { resendDelay?: number }) => (
    <div data-testid="phone-form" data-resend-delay={resendDelay}>
      Phone Form
    </div>
  ),
}));

describe("PhoneAuthScreen", () => {
  it("displays the correct title and subtitle", () => {
    const { getByText } = render(<PhoneAuthScreen />);

    expect(getByText("Sign in")).toBeInTheDocument();
    expect(getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("calls useConfig to retrieve the language", () => {
    const { getByText } = render(<PhoneAuthScreen />);

    expect(getByText("Sign in")).toBeInTheDocument();
  });

  it("includes the PhoneForm with the correct resendDelay prop", () => {
    const { getByTestId } = render(<PhoneAuthScreen resendDelay={60} />);

    const phoneForm = getByTestId("phone-form");
    expect(phoneForm).toBeInTheDocument();
    expect(phoneForm.getAttribute("data-resend-delay")).toBe("60");
  });

  it("renders children when provided", () => {
    const { getByText, getByTestId } = render(
      <PhoneAuthScreen>
        <button data-testid="test-button">Test Button</button>
      </PhoneAuthScreen>
    );

    expect(getByTestId("test-button")).toBeInTheDocument();
    expect(getByText("OR")).toBeInTheDocument();
  });

  it("does not render children or divider when not provided", () => {
    const { queryByText } = render(<PhoneAuthScreen />);

    expect(queryByText("OR")).not.toBeInTheDocument();
  });
});
