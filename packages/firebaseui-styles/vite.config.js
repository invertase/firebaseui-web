import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: "copy-styles",
      writeBundle() {
        fs.copyFileSync(
          resolve(__dirname, "src/styles.css"),
          resolve(__dirname, "dist/styles.css")
        );
        fs.copyFileSync(
          resolve(__dirname, "src/auth.css"),
          resolve(__dirname, "dist/auth.css")
        );
      },
    },
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "src/styles.css"),
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name === "styles.css"
            ? "dist.css"
            : assetInfo.name || "unknown.css",
      },
    },
  },
});
