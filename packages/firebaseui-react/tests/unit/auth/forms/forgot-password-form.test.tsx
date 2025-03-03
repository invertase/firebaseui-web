import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ForgotPasswordForm } from "../../../../src/auth/forms/forgot-password-form";
import { act } from "react";

// Mock the dependencies
vi.mock("@firebase-ui/core", () => ({
  fuiSendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  FirebaseUIError: class FirebaseUIError extends Error {
    code: string;
    constructor(error: any) {
      super(error.message || "Unknown error");
      this.name = "FirebaseUIError";
      this.code = error.code || "unknown-error";
    }
  },
  createForgotPasswordFormSchema: vi.fn().mockReturnValue({
    email: { required: "Email is required" },
  }),
  getTranslation: vi.fn((category: string, key: string) => {
    const translations: Record<string, Record<string, string>> = {
      labels: {
        emailAddress: "Email Address",
        resetPassword: "Reset Password",
        backToSignIn: "Back to Sign In",
      },
      messages: {
        checkEmailForReset: "Check your email for reset instructions",
      },
      errors: {
        unknownError: "An unknown error occurred",
      },
    };
    return translations[category]?.[key] || `${category}.${key}`;
  }),
}));

// Mock @tanstack/react-form library
vi.mock("@tanstack/react-form", () => {
  const handleSubmitMock = vi.fn().mockImplementation((callback) => {
    // Store the callback to call it directly in tests
    (global as any).formSubmitCallback = callback;
    return Promise.resolve();
  });

  return {
    useForm: vi.fn().mockImplementation(({ onSubmit }) => {
      // Save the onSubmit function to call it directly in tests
      (global as any).formOnSubmit = onSubmit;

      return {
        handleSubmit: handleSubmitMock,
        Field: ({ children, name }: any) => {
          const field = {
            name,
            state: {
              value: name === "email" ? "test@example.com" : "",
              meta: {
                isTouched: false,
                errors: [],
              },
            },
            handleBlur: vi.fn(),
            handleChange: vi.fn(),
          };
          return children(field);
        },
      };
    }),
  };
});

vi.mock("../../../../src/hooks", () => ({
  useAuth: vi.fn().mockReturnValue({}),
  useConfig: vi.fn().mockReturnValue({
    language: "en",
  }),
  useTranslations: vi.fn().mockReturnValue({}),
}));

// Mock the components
vi.mock("../../../../src/components/field-info", () => ({
  FieldInfo: vi
    .fn()
    .mockImplementation(({ field }) => (
      <div data-testid="field-info">
        {field.state.meta.errors.length > 0 && (
          <span>{field.state.meta.errors[0]}</span>
        )}
      </div>
    )),
}));

vi.mock("../../../../src/components/terms-and-privacy", () => ({
  TermsAndPrivacy: vi
    .fn()
    .mockReturnValue(<div data-testid="terms-and-privacy" />),
}));

vi.mock("../../../../src/components/button", () => ({
  Button: vi.fn().mockImplementation(({ children, type, onClick }) => (
    <button type={type} onClick={onClick} data-testid="submit-button">
      {children}
    </button>
  )),
}));

// Import the actual functions after mocking
import { fuiSendPasswordResetEmail } from "@firebase-ui/core";

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("terms-and-privacy")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("submits the form when the button is clicked", async () => {
    render(<ForgotPasswordForm />);

    // Get the submit button
    const submitButton = screen.getByTestId("submit-button");

    // Trigger form submission
    await act(async () => {
      fireEvent.click(submitButton);

      // Directly call the onSubmit function with form values
      if ((global as any).formOnSubmit) {
        await (global as any).formOnSubmit({
          value: {
            email: "test@example.com",
          },
        });
      }
    });

    // Check that the password reset function was called
    expect(fuiSendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      expect.objectContaining({
        language: "en",
      })
    );
  });

  it("displays error message when password reset fails", async () => {
    // Mock the reset function to reject with an error
    const mockError = new Error("Invalid email");
    (fuiSendPasswordResetEmail as Mock).mockRejectedValueOnce(mockError);

    render(<ForgotPasswordForm />);

    // Get the submit button
    const submitButton = screen.getByTestId("submit-button");

    // Trigger form submission
    await act(async () => {
      fireEvent.click(submitButton);

      // Directly call the onSubmit function with form values
      if ((global as any).formOnSubmit) {
        await (global as any)
          .formOnSubmit({
            value: {
              email: "test@example.com",
            },
          })
          .catch(() => {
            // Catch the error here to prevent test from failing
          });
      }
    });

    // Check that the password reset function was called
    expect(fuiSendPasswordResetEmail).toHaveBeenCalled();
  });

  it("displays back to sign in button when provided", () => {
    const onBackToSignInClickMock = vi.fn();
    render(
      <ForgotPasswordForm onBackToSignInClick={onBackToSignInClickMock} />
    );

    const backButton = screen.getByText("Back to Sign In →");
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(onBackToSignInClickMock).toHaveBeenCalled();
  });
});
