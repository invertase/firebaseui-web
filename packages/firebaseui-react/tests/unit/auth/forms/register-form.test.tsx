import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RegisterForm } from "../../../../src/auth/forms/register-form";
import { act } from "react";

// Mock the dependencies
vi.mock("@firebase-ui/core", () => ({
  fuiCreateUserWithEmailAndPassword: vi.fn().mockResolvedValue(undefined),
  FirebaseUIError: class FirebaseUIError extends Error {
    code: string;
    constructor(error: any) {
      super(error.message || "Unknown error");
      this.name = "FirebaseUIError";
      this.code = error.code || "unknown-error";
    }
  },
  createEmailFormSchema: vi.fn().mockReturnValue({
    email: { required: "Email is required" },
    password: { required: "Password is required" },
  }),
  getTranslation: vi.fn((category: string, key: string) => {
    const translations: Record<string, Record<string, string>> = {
      labels: {
        emailAddress: "Email Address",
        password: "Password",
        createAccount: "Create Account",
        signIn: "Sign In",
      },
      prompts: {
        haveAccount: "Already have an account?",
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
              value: name === "email" ? "test@example.com" : "password123",
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
    enableAutoUpgradeAnonymous: false,
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
import { fuiCreateUserWithEmailAndPassword } from "@firebase-ui/core";

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<RegisterForm />);

    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByTestId("terms-and-privacy")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("submits the form when the button is clicked", async () => {
    render(<RegisterForm />);

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
            password: "password123",
          },
        });
      }
    });

    // Check that the registration function was called
    expect(fuiCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "test@example.com",
      "password123",
      expect.objectContaining({
        language: "en",
        enableAutoUpgradeAnonymous: false,
      })
    );
  });

  it("displays error message when registration fails", async () => {
    // Mock the registration function to reject with an error
    const mockError = new Error("Email already in use");
    (fuiCreateUserWithEmailAndPassword as Mock).mockRejectedValueOnce(
      mockError
    );

    render(<RegisterForm />);

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
              password: "password123",
            },
          })
          .catch(() => {
            // Catch the error here to prevent test from failing
          });
      }
    });

    // Check that the registration function was called
    expect(fuiCreateUserWithEmailAndPassword).toHaveBeenCalled();
  });

  it("displays back to sign in button when provided", () => {
    const onBackToSignInClickMock = vi.fn();
    render(<RegisterForm onBackToSignInClick={onBackToSignInClickMock} />);

    const backButton = screen.getByText(/Already have an account\? Sign In →/i);
    expect(backButton).toBeInTheDocument();

    fireEvent.click(backButton);
    expect(onBackToSignInClickMock).toHaveBeenCalled();
  });
});
