import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // resolve: {
  //   alias: {
  //     "~": resolve(__dirname, "src/"),
  //   },
  // },
  css: {
    postcss: './postcss.config.mjs', // Ensure Tailwind is processed
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "firebaseui",
      fileName: "index",
    },
    rollupOptions: {
      external: ["firebase"],
    },
  },
  plugins: [tsconfigPaths(), dts()],
});
