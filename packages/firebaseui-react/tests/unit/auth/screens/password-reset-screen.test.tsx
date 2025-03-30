import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { PasswordResetScreen } from "~/auth/screens/password-reset-screen";
import * as hooks from "~/hooks";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useConfig: vi.fn(),
  useTranslations: vi.fn(),
}));

// Mock dependencies
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "resetPassword")
      return "Reset Password";
    if (category === "prompts" && key === "enterEmailToReset")
      return "Enter your email to reset your password";
    return key;
  }),
}));

// Mock the ForgotPasswordForm component
vi.mock("~/auth/forms/forgot-password-form", () => ({
  ForgotPasswordForm: ({
    onBackToSignInClick,
  }: {
    onBackToSignInClick?: () => void;
  }) => (
    <div data-testid="forgot-password-form">
      <button onClick={onBackToSignInClick} data-testid="back-button">
        Back to Sign In
      </button>
    </div>
  ),
}));

describe("PasswordResetScreen", () => {
  const mockOnBackToSignInClick = vi.fn();

  beforeEach(() => {
    // Setup default mock values
    vi.mocked(hooks.useUI).mockReturnValue({
      language: "en",
    } as any);

    vi.mocked(hooks.useTranslations).mockReturnValue({} as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct title and subtitle", () => {
    const { getByText } = render(<PasswordResetScreen />);

    expect(getByText("Reset Password")).toBeInTheDocument();
    expect(
      getByText("Enter your email to reset your password")
    ).toBeInTheDocument();
  });

  it("calls useConfig to get the language", () => {
    render(<PasswordResetScreen />);

    expect(hooks.useUI).toHaveBeenCalled();
  });

  it("includes the ForgotPasswordForm component", () => {
    const { getByTestId } = render(<PasswordResetScreen />);

    expect(getByTestId("forgot-password-form")).toBeInTheDocument();
  });

  it("passes onBackToSignInClick to ForgotPasswordForm", () => {
    const { getByTestId } = render(
      <PasswordResetScreen onBackToSignInClick={mockOnBackToSignInClick} />
    );

    // Click the back button in the mocked form
    fireEvent.click(getByTestId("back-button"));

    // Verify the callback was called
    expect(mockOnBackToSignInClick).toHaveBeenCalledTimes(1);
  });
});
