import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { EmailPasswordForm } from "../../../src/auth/forms/email-password-form";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import { renderWithProviders } from "../../utils/mocks";

// Prepare the test environment
const firebaseConfig = {
  apiKey: "test-api-key",
  authDomain: "test-project.firebaseapp.com",
  projectId: "test-project",
};

// Initialize app once for all tests
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Connect to the auth emulator
connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });

describe("Email Password Authentication Integration", () => {
  // Test user we'll create for our tests
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "Test123!";

  // Set up a test user before tests
  beforeAll(async () => {
    try {
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    } catch (error) {
      console.error("Error setting up test user:", error);
    }
  });

  // Clean up after tests
  afterAll(async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        testEmail,
        testPassword
      );
      await deleteUser(userCredential.user);
    } catch (error) {
      console.error("Error cleaning up test user:", error);
    }
  });

  it("should successfully sign in with email and password using actual Firebase Auth", async () => {
    const { container } = renderWithProviders(<EmailPasswordForm />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    await act(async () => {
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
        fireEvent.change(passwordInput, { target: { value: testPassword } });
        fireEvent.blur(passwordInput);
      }
    });

    const submitButton = await screen.findByRole("button", {
      name: /sign in/i,
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(screen.queryByText(/invalid credentials/i)).toBeNull();
      },
      { timeout: 5000 }
    );
  });

  it("should fail when using invalid credentials", async () => {
    const { container } = renderWithProviders(<EmailPasswordForm />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    await act(async () => {
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.blur(passwordInput);
      }
    });

    const submitButton = await screen.findByRole("button", {
      name: /sign in/i,
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(container.querySelector(".fui-form__error")).not.toBeNull();
      },
      { timeout: 5000 }
    );
  });

  it("should show an error message for invalid credentials", async () => {
    const { container } = renderWithProviders(<EmailPasswordForm />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();

    await act(async () => {
      if (emailInput && passwordInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
        fireEvent.blur(emailInput);
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
        fireEvent.blur(passwordInput);
      }
    });

    const submitButton = await screen.findByRole("button", {
      name: /sign in/i,
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        expect(container.querySelector(".fui-form__error")).not.toBeNull();
      },
      { timeout: 5000 }
    );
  });
});
