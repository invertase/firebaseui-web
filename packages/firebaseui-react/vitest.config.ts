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
    // Use tsconfig.test.json for TypeScript
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.test.json",
      include: ["tests/**/*.{ts,tsx}"],
    },
    // Increase test timeout for Firebase operations
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
});
