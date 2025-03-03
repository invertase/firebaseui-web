import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@firebase-ui/core": path.resolve(__dirname, "../firebaseui-core/src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
