import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SignInAuthScreen } from "~/auth/screens/sign-in-auth-screen";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useUI: () => ({
    locale: "en-US",
    translations: {
      "en-US": {
        labels: {
          signIn: "Sign in",
          dividerOr: "or",
        },
        prompts: {
          signInToAccount: "Sign in to your account",
        },
      },
    },
  }),
}));

// Mock the EmailPasswordForm component
vi.mock("~/auth/forms/email-password-form", () => ({
  EmailPasswordForm: ({
    onForgotPasswordClick,
    onRegisterClick,
  }: {
    onForgotPasswordClick?: () => void;
    onRegisterClick?: () => void;
  }) => (
    <div data-testid="email-password-form">
      <button
        data-testid="forgot-password-button"
        onClick={onForgotPasswordClick}
      >
        Forgot Password
      </button>
      <button data-testid="register-button" onClick={onRegisterClick}>
        Register
      </button>
    </div>
  ),
}));

describe("SignInAuthScreen", () => {
  it("displays the correct title and subtitle", () => {
    const { getByText } = render(<SignInAuthScreen />);

    expect(getByText("Sign in")).toBeInTheDocument();
    expect(getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("calls useConfig to retrieve the language", () => {
    const { getByText } = render(<SignInAuthScreen />);

    expect(getByText("Sign in")).toBeInTheDocument();
  });

  it("includes the EmailPasswordForm component", () => {
    const { getByTestId } = render(<SignInAuthScreen />);

    expect(getByTestId("email-password-form")).toBeInTheDocument();
  });

  it("passes onForgotPasswordClick to EmailPasswordForm", () => {
    const mockOnForgotPasswordClick = vi.fn();
    const { getByTestId } = render(
      <SignInAuthScreen onForgotPasswordClick={mockOnForgotPasswordClick} />
    );

    const forgotPasswordButton = getByTestId("forgot-password-button");
    fireEvent.click(forgotPasswordButton);

    expect(mockOnForgotPasswordClick).toHaveBeenCalledTimes(1);
  });

  it("passes onRegisterClick to EmailPasswordForm", () => {
    const mockOnRegisterClick = vi.fn();
    const { getByTestId } = render(
      <SignInAuthScreen onRegisterClick={mockOnRegisterClick} />
    );

    const registerButton = getByTestId("register-button");
    fireEvent.click(registerButton);

    expect(mockOnRegisterClick).toHaveBeenCalledTimes(1);
  });

  it("renders children when provided", () => {
    const { getByText, getByTestId } = render(
      <SignInAuthScreen>
        <button data-testid="test-button">Test Button</button>
      </SignInAuthScreen>
    );

    expect(getByTestId("test-button")).toBeInTheDocument();
    expect(getByText("or")).toBeInTheDocument();
  });

  it("does not render children or divider when not provided", () => {
    const { queryByText } = render(<SignInAuthScreen />);

    expect(queryByText("or")).not.toBeInTheDocument();
  });
});
