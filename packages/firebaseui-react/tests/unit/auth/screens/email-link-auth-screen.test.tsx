import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { EmailLinkAuthScreen } from "~/auth/screens/email-link-auth-screen";
import * as hooks from "~/hooks";

// Mock the hooks
vi.mock("~/hooks", () => ({
  useConfig: vi.fn(),
  useTranslations: vi.fn(),
}));

// Mock dependencies
vi.mock("@firebase-ui/core", () => ({
  getTranslation: vi.fn((category, key) => {
    if (category === "labels" && key === "signIn") return "Sign In";
    if (category === "prompts" && key === "signInToAccount")
      return "Sign in to your account";
    if (category === "messages" && key === "dividerOr") return "or";
    return key;
  }),
}));

// Mock the EmailLinkForm component
vi.mock("~/auth/forms/email-link-form", () => ({
  EmailLinkForm: () => <div data-testid="email-link-form">Email Link Form</div>,
}));

describe("EmailLinkAuthScreen", () => {
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
    const { getByText } = render(<EmailLinkAuthScreen />);

    expect(getByText("Sign In")).toBeInTheDocument();
    expect(getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("calls useConfig to get the language", () => {
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
