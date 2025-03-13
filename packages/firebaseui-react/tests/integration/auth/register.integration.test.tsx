import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { RegisterForm } from "../../../src/auth/forms/register-form";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  deleteUser,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { renderWithProviders } from "../../utils/mocks";
import { getTranslation } from "@firebase-ui/core";

// Prepare the test environment
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-firebaseui.firebaseapp.com",
  projectId: "demo-firebaseui",
};

// Initialize app once for all tests
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to the auth emulator
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

describe("Register Integration", () => {
  const testPassword = "Test123!";
  let testEmail: string;

  // Clean up before each test
  beforeEach(async () => {
    // Generate a unique email for each test
    testEmail = `test-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}@example.com`;

    // Try to sign in with the test email and delete the user if it exists
    try {
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch (error) {
      // Ignore errors if user doesn't exist
    }
    await signOut(auth);
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      await signInWithEmailAndPassword(auth, testEmail, testPassword);
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch (error) {
      // Ignore errors if user doesn't exist
    }
  });

  it("should successfully register a new user", async () => {
    const { container } = renderWithProviders(<RegisterForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(container.querySelector('input[type="email"]')).not.toBeNull();
    });

    // Fill in email
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
      }
    });

    // Fill in password
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).not.toBeNull();

    await act(async () => {
      if (passwordInput) {
        fireEvent.change(passwordInput, { target: { value: testPassword } });
        fireEvent.blur(passwordInput);
      }
    });

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "createAccount", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for form submission to complete (no error message)
    await waitFor(
      () => {
        const errorElement = container.querySelector(".fui-form__error");
        expect(errorElement).toBeNull();
      },
      { timeout: 10000 }
    );

    // Verify user is created and signed in with a longer timeout
    await waitFor(
      () => {
        expect(auth.currentUser).not.toBeNull();
        if (auth.currentUser) {
          expect(auth.currentUser.email).toBe(testEmail);
        }
      },
      { timeout: 10000 }
    );
  });

  it("should handle invalid email format", async () => {
    const { container } = renderWithProviders(<RegisterForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(container.querySelector('input[type="email"]')).not.toBeNull();
    });

    // Fill in invalid email
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.blur(emailInput);
      }
    });

    // Fill in password
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).not.toBeNull();

    await act(async () => {
      if (passwordInput) {
        fireEvent.change(passwordInput, { target: { value: testPassword } });
        fireEvent.blur(passwordInput);
      }
    });

    // Submit form
    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "createAccount", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Wait for error message with longer timeout
    await waitFor(
      () => {
        const errorElement = container.querySelector(".fui-form__error");
        expect(errorElement).not.toBeNull();
        if (errorElement) {
          expect(errorElement.textContent).toBe(
            "Please enter a valid email address"
          );
        }
      },
      { timeout: 10000 }
    );
  });

  it("should handle duplicate email", async () => {
    // First register a user
    const { container } = renderWithProviders(<RegisterForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(container.querySelector('input[type="email"]')).not.toBeNull();
    });

    // Fill in email
    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "createAccount", { en: {} }, "en"),
    });

    await act(async () => {
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
        fireEvent.change(passwordInput, { target: { value: testPassword } });
        fireEvent.blur(passwordInput);
        fireEvent.click(submitButton);
      }
    });

    // Wait for form submission to complete (no error message)
    await waitFor(
      () => {
        const errorElement = container.querySelector(".fui-form__error");
        expect(errorElement).toBeNull();
      },
      { timeout: 10000 }
    );

    // Wait for first registration to complete and user to be signed in
    await waitFor(
      () => {
        expect(auth.currentUser).not.toBeNull();
        if (auth.currentUser) {
          expect(auth.currentUser.email).toBe(testEmail);
        }
      },
      { timeout: 10000 }
    );

    // Sign out to try registering again
    await signOut(auth);

    // Try to register with same email
    const newContainer = renderWithProviders(<RegisterForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(
        newContainer.container.querySelector('input[type="email"]')
      ).not.toBeNull();
    });

    // Fill in email
    const newEmailInput = newContainer.container.querySelector(
      'input[type="email"]'
    );
    const newPasswordInput = newContainer.container.querySelector(
      'input[type="password"]'
    );
    const buttons = screen.getAllByRole("button", {
      name: getTranslation("labels", "createAccount", { en: {} }, "en"),
    });
    const newSubmitButton = buttons[buttons.length - 1]; // Get the most recently added button

    await act(async () => {
      if (newEmailInput && newPasswordInput) {
        fireEvent.change(newEmailInput, { target: { value: testEmail } });
        fireEvent.blur(newEmailInput);
        fireEvent.change(newPasswordInput, { target: { value: testPassword } });
        fireEvent.blur(newPasswordInput);
        fireEvent.click(newSubmitButton);
      }
    });

    // Wait for error message with longer timeout
    await waitFor(
      () => {
        const errorElement =
          newContainer.container.querySelector(".fui-form__error");
        expect(errorElement).not.toBeNull();
        if (errorElement) {
          expect(errorElement.textContent).toBe(
            "An account already exists with this email"
          );
        }
      },
      { timeout: 10000 }
    );
  });
});
