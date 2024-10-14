/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        theme: {
          DEFAULT: "hsl(var(--primary, 34 100% 50%) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
