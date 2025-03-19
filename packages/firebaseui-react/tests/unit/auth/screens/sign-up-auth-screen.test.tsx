import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignUpAuthScreen } from "~/auth/screens/sign-up-auth-screen";
import * as Hooks from "~/hooks";
import { getTranslation } from "@firebase-ui/core";

// Mock hooks
vi.mock("~/hooks", () => ({
  useConfig: vi.fn(),
  useTranslations: vi.fn(),
}));

// Mock translations
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "register") return "Create Account";
    if (category === "prompts" && key === "enterDetailsToCreate")
      return "Enter your details to create an account";
    if (category === "messages" && key === "dividerOr") return "OR";
    return `${category}.${key}`;
  }),
}));

// Mock RegisterForm component
vi.mock("~/auth/forms/register-form", () => ({
  RegisterForm: ({
    onBackToSignInClick,
  }: {
    onBackToSignInClick?: () => void;
  }) => (
    <div data-testid="register-form">
      <button
        data-testid="back-to-sign-in-button"
        onClick={onBackToSignInClick}
      >
        Back to Sign In
      </button>
    </div>
  ),
}));

describe("SignUpAuthScreen", () => {
  beforeEach(() => {
    vi.mocked(Hooks.useConfig).mockReturnValue({
      language: "en",
    } as any);
    vi.mocked(Hooks.useTranslations).mockReturnValue({} as any);
  });

  it("renders the correct title and subtitle", () => {
    render(<SignUpAuthScreen />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(
      screen.getByText("Enter your details to create an account")
    ).toBeInTheDocument();
  });

  it("retrieves the language from the config", () => {
    render(<SignUpAuthScreen />);

    expect(Hooks.useConfig).toHaveBeenCalled();
    expect(getTranslation).toHaveBeenCalledWith(
      "labels",
      "register",
      expect.anything(),
      "en"
    );
  });

  it("includes the RegisterForm component", () => {
    render(<SignUpAuthScreen />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("passes the onBackToSignInClick prop to the RegisterForm", async () => {
    const onBackToSignInClick = vi.fn();
    render(<SignUpAuthScreen onBackToSignInClick={onBackToSignInClick} />);

    const backButton = screen.getByTestId("back-to-sign-in-button");
    backButton.click();

    expect(onBackToSignInClick).toHaveBeenCalled();
  });

  it("renders children when provided", () => {
    render(
      <SignUpAuthScreen>
        <div data-testid="test-child">Child element</div>
      </SignUpAuthScreen>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
  });

  it("does not render divider or children container when no children are provided", () => {
    render(<SignUpAuthScreen />);

    expect(screen.queryByText("OR")).not.toBeInTheDocument();
  });
});
