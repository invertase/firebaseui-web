import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    // Use the same environment as the package
    environment: "jsdom",
    // Include TypeScript files
    include: ["tests/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    // Exclude build output and node_modules
    exclude: ["node_modules/**/*", "dist/**/*"],
    // Enable globals for jest-dom to work correctly
    globals: true,
    // Use the setup file for all tests
    setupFiles: ["./tests/setup-test.ts"],
    // Mock modules
    mockReset: false,
    // Different test modes
    environmentMatchGlobs: [
      // Use jsdom for unit and integration tests
      ["tests/unit/**", "jsdom"],
      ["tests/integration/**", "jsdom"],
      // Use node for e2e tests if they don't need a browser
      ["tests/e2e/**", "node"],
    ],
    // Use tsconfig.test.json for TypeScript
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.test.json",
      include: ["tests/**/*.{ts,tsx}"],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
      "@firebase-ui/core": resolve(
        __dirname,
        "./tests/__mocks__/@firebase-ui/core.ts"
      ),
    },
  },
});
