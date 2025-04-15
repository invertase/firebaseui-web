import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { FirebaseUIProvider, FirebaseUIContext } from "../../../src/context";
import { map } from "nanostores";
import { useContext } from "react";
import { FirebaseUI, FirebaseUIConfiguration } from "@firebase-ui/core";

// Mock component to test context value
function TestConsumer() {
  const config = useContext(FirebaseUIContext);
  return <div data-testid="test-value">{config.locale || "no-value"}</div>;
}

describe("ConfigProvider", () => {
  it("provides the config value to children", () => {
    // Create a mock config store with the correct FUIConfig properties
    const mockConfig = map<Pick<FirebaseUIConfiguration, 'locale'>>({
      locale: "en-US",
    }) as FirebaseUI;

    const { getByTestId } = render(
      <FirebaseUIProvider ui={mockConfig}>
        <TestConsumer />
      </FirebaseUIProvider>
    );

    expect(getByTestId("test-value").textContent).toBe("en-US");
  });

  it("updates when the config store changes", () => {
    // Create a mock config store
    const mockConfig = map<Pick<FirebaseUIConfiguration, 'locale'>>({
      locale: "en-US",
    }) as FirebaseUI;

    const { getByTestId } = render(
      <FirebaseUIProvider ui={mockConfig}>
        <TestConsumer />
      </FirebaseUIProvider>
    );

    expect(getByTestId("test-value").textContent).toBe("en-US");

    // Update the config store inside act()
    act(() => {
      mockConfig.setKey("locale", "fr-FR");
    });

    // Check that the context value was updated
    expect(getByTestId("test-value").textContent).toBe("fr-FR");
  });
});
