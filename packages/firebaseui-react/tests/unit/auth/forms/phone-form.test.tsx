import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneForm } from "../../../../src/auth/forms/phone-form";
import { act } from "react";

// Mock Firebase Auth
vi.mock("firebase/auth", () => ({
  RecaptchaVerifier: vi.fn().mockImplementation(() => ({
    render: vi.fn().mockResolvedValue("recaptcha-token"),
    clear: vi.fn(),
    verify: vi.fn().mockResolvedValue("verification-token"),
  })),
  ConfirmationResult: vi.fn(),
}));

// Mock the core dependencies
vi.mock("@firebase-ui/core", () => ({
  FirebaseUIError: class FirebaseUIError extends Error {
    code: string;
    constructor(error: any) {
      super(error.message || "Unknown error");
      this.name = "FirebaseUIError";
      this.code = error.code || "unknown-error";
    }
  },
  fuiSignInWithPhoneNumber: vi.fn().mockResolvedValue({
    confirm: vi.fn().mockResolvedValue(undefined),
  }),
  fuiConfirmPhoneNumber: vi.fn().mockResolvedValue(undefined),
  createPhoneFormSchema: vi.fn().mockReturnValue({
    phoneNumber: { required: "Phone number is required" },
    verificationCode: { required: "Verification code is required" },
    pick: vi.fn().mockReturnValue({
      phoneNumber: { required: "Phone number is required" },
    }),
  }),
  getTranslation: vi.fn((category: string, key: string) => {
    const translations: Record<string, Record<string, string>> = {
      labels: {
        phoneNumber: "Phone Number",
        submit: "Submit",
        sendVerificationCode: "Send Verification Code",
        verificationCode: "Verification Code",
        verify: "Verify",
        resendCode: "Resend Code",
      },
      messages: {
        resendCodeIn: "Resend code in {{seconds}} seconds",
      },
      errors: {
        unknownError: "An unknown error occurred",
      },
    };
    return translations[category]?.[key] || `${category}.${key}`;
  }),
  countryData: [
    {
      code: "US",
      name: "United States",
      dialCode: "+1",
      emoji: "🇺🇸",
    },
    {
      code: "GB",
      name: "United Kingdom",
      dialCode: "+44",
      emoji: "🇬🇧",
    },
  ],
  formatPhoneNumberWithCountry: vi.fn(
    (phoneNumber, dialCode) => `${dialCode}${phoneNumber}`
  ),
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
              value: name === "phoneNumber" ? "1234567890" : "123456",
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

// Mock hooks
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
    .mockReturnValue(
      <div data-testid="terms-and-privacy">Terms & Privacy</div>
    ),
}));

vi.mock("../../../../src/components/button", () => ({
  Button: vi.fn().mockImplementation(({ children, type, onClick }) => (
    <button type={type} onClick={onClick} data-testid="submit-button">
      {children}
    </button>
  )),
}));

vi.mock("../../../../src/components/country-selector", () => ({
  CountrySelector: vi.fn().mockImplementation(({ value, onChange }) => (
    <div data-testid="country-selector">
      <select
        onChange={(e) =>
          onChange &&
          onChange({
            code: e.target.value,
            name: e.target.value === "US" ? "United States" : "United Kingdom",
            dialCode: e.target.value === "US" ? "+1" : "+44",
            emoji: e.target.value === "US" ? "🇺🇸" : "🇬🇧",
          })
        }
        value={value?.code}
      >
        <option value="US">United States</option>
        <option value="GB">United Kingdom</option>
      </select>
    </div>
  )),
}));

// Import the actual functions after mocking
import { fuiSignInWithPhoneNumber } from "@firebase-ui/core";

describe("PhoneForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the global state
    (global as any).formOnSubmit = null;
    (global as any).formSubmitCallback = null;
  });

  it("renders the phone number form initially", () => {
    render(<PhoneForm />);

    expect(
      screen.getByRole("textbox", { name: /phone number/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("country-selector")).toBeInTheDocument();
    expect(screen.getByTestId("terms-and-privacy")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("attempts to send verification code when phone number is submitted", async () => {
    render(<PhoneForm />);

    // Get the submit button
    const submitButton = screen.getByTestId("submit-button");

    // Trigger form submission
    await act(async () => {
      fireEvent.click(submitButton);

      // Directly call the onSubmit function with form values
      if ((global as any).formOnSubmit) {
        await (global as any).formOnSubmit({
          value: {
            phoneNumber: "1234567890",
          },
        });
      }
    });

    // Check that the phone verification function was called with any parameters
    expect(fuiSignInWithPhoneNumber).toHaveBeenCalled();
    // Verify the phone number is in the second parameter
    expect(fuiSignInWithPhoneNumber).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringMatching(/1234567890/),
      expect.anything(),
      expect.anything()
    );
  });

  it("displays error message when phone verification fails", async () => {
    const mockError = new Error("Invalid phone number");
    (mockError as any).code = "auth/invalid-phone-number";
    (
      fuiSignInWithPhoneNumber as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValueOnce(mockError);

    render(<PhoneForm />);

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
              phoneNumber: "1234567890",
            },
          })
          .catch(() => {
            // Catch the error to prevent it from failing the test
          });
      }
    });

    // The UI should show the error message in the form__error div
    expect(screen.getByText("An unknown error occurred")).toBeInTheDocument();
  });
});
