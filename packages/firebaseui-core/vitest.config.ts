import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use the same environment as the package
    environment: 'jsdom',
    // Include TypeScript files
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    // Exclude build output and node_modules
    exclude: ['node_modules/**/*', 'dist/**/*'],
  },
});
