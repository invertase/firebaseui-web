import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { FirebaseUIProvider } from "../../../src/context/ui-provider";
import { FirebaseUIContext } from "../../../src/context/ui-context";
import { map } from "nanostores";
import { useContext } from "react";
import { FUIConfig } from "@firebase-ui/core";

// Mock component to test context value
function TestConsumer() {
  const config = useContext(FirebaseUIContext);
  return <div data-testid="test-value">{config.language || "no-value"}</div>;
}

describe("ConfigProvider", () => {
  it("provides the config value to children", () => {
    // Create a mock config store with the correct FUIConfig properties
    const mockConfig = map<FUIConfig>({
      language: "en",
    });

    const { getByTestId } = render(
      <FirebaseUIProvider config={mockConfig}>
        <TestConsumer />
      </FirebaseUIProvider>
    );

    expect(getByTestId("test-value").textContent).toBe("en");
  });

  it("updates when the config store changes", () => {
    // Create a mock config store
    const mockConfig = map<FUIConfig>({
      language: "en",
    });

    const { getByTestId } = render(
      <FirebaseUIProvider config={mockConfig}>
        <TestConsumer />
      </FirebaseUIProvider>
    );

    expect(getByTestId("test-value").textContent).toBe("en");

    // Update the config store inside act()
    act(() => {
      mockConfig.setKey("language", "fr");
    });

    // Check that the context value was updated
    expect(getByTestId("test-value").textContent).toBe("fr");
  });
});
