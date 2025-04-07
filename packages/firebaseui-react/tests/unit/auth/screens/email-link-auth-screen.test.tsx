import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { EmailLinkAuthScreen } from "~/auth/screens/email-link-auth-screen";
import * as hooks from "~/hooks";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useUI: vi.fn(() => ({
    locale: "en-US",
    translations: {
      "en-US": {
        labels: {
          signIn: "Sign In",
        },
        prompts: {
          signInToAccount: "Sign in to your account",
        },
        messages: {
          dividerOr: "or",
        },
      },
    },
  })),
}));

// Mock the EmailLinkForm component
vi.mock("~/auth/forms/email-link-form", () => ({
  EmailLinkForm: () => <div data-testid="email-link-form">Email Link Form</div>,
}));

describe("EmailLinkAuthScreen", () => {
  beforeEach(() => {
    // Setup default mock values
    vi.mocked(hooks.useUI).mockReturnValue({
      locale: "en-US",
    } as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders with correct title and subtitle", () => {
    const { getByText } = render(<EmailLinkAuthScreen />);

    expect(getByText("Sign In")).toBeInTheDocument();
    expect(getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("calls useUI to get the locale", () => {
    render(<EmailLinkAuthScreen />);
    expect(hooks.useUI).toHaveBeenCalled();
  });

  it("includes the EmailLinkForm component", () => {
    const { getByTestId } = render(<EmailLinkAuthScreen />);

    expect(getByTestId("email-link-form")).toBeInTheDocument();
  });

  it("does not render divider and children when no children are provided", () => {
    const { queryByText } = render(<EmailLinkAuthScreen />);

    expect(queryByText("or")).not.toBeInTheDocument();
  });

  it("renders divider and children when children are provided", () => {
    const { getByText } = render(
      <EmailLinkAuthScreen>
        <div>Test Child</div>
      </EmailLinkAuthScreen>
    );

    expect(getByText("or")).toBeInTheDocument();
    expect(getByText("Test Child")).toBeInTheDocument();
  });
});
