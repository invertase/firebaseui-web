import { defineConfig } from "vitest/config";

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
    // Use tsconfig.test.json for TypeScript
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.test.json",
      include: ["tests/**/*.{ts,tsx}"],
    },
  },
});
