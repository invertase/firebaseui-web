import { describe, it, expect, afterAll } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { EmailLinkForm } from "../../../src/auth/forms/email-link-form";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, deleteUser } from "firebase/auth";
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

describe("Email Link Authentication Integration", () => {
  const testEmail = `test-${Date.now()}@example.com`;

  // Clean up after tests
  afterAll(async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }
    } catch (error) {
      console.error("Error cleaning up test user:", error);
    }
  });

  it("should successfully initiate email link sign in", async () => {
    const { container } = renderWithProviders(<EmailLinkForm />);

    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: testEmail } });
      }
    });

    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "sendSignInLink", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(
      () => {
        // Should show success message from translations
        expect(
          screen.queryByText(
            getTranslation("messages", "signInLinkSent", { en: {} }, "en")
          )
        ).not.toBeNull();
      },
      { timeout: 5000 }
    );
  });

  it("should handle invalid email format", async () => {
    const { container } = renderWithProviders(<EmailLinkForm />);

    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).not.toBeNull();

    await act(async () => {
      if (emailInput) {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        // Trigger blur to show validation error
        fireEvent.blur(emailInput);
      }
    });

    const submitButton = screen.getByRole("button", {
      name: getTranslation("labels", "sendSignInLink", { en: {} }, "en"),
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(container.querySelector(".fui-form__error")).not.toBeNull();
    });
  });
});
