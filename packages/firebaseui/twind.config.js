import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind()],
  theme: {
    extend: {
      colors: {
        theme: {
          DEFAULT: "hsl(var(--theme-primary) / <alpha-value>)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--theme-radius)",
      },
    },
  },
});
