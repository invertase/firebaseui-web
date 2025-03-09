import { describe, it, expect, afterAll, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ForgotPasswordForm } from "../../../src/auth/forms/forgot-password-form";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  deleteUser,
  signOut,
  createUserWithEmailAndPassword,
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

describe("Forgot Password Integration", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Test123!";

  // Clean up before each test
  beforeEach(async () => {
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

  it("should successfully send password reset email", async () => {
    // Create a user first
    await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    await signOut(auth);

    const { container } = renderWithProviders(<ForgotPasswordForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(container.querySelector('input[type="email"]')).not.toBeNull();
    });

    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
      }
    });

    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "resetPassword", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(
          screen.queryByText(
            getTranslation("messages", "checkEmailForReset", { en: {} }, "en")
          )
        ).not.toBeNull();
      },
      { timeout: 10000 }
    );
  });

  it("should handle invalid email format", async () => {
    const { container } = renderWithProviders(<ForgotPasswordForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(container.querySelector('input[type="email"]')).not.toBeNull();
    });

    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.blur(emailInput);
      }
    });

    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "resetPassword", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

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
});
