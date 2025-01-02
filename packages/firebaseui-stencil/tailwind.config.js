/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--fui-primary-50)',
          100: 'var(--fui-primary-100)',
          200: 'var(--fui-primary-200)',
          300: 'var(--fui-primary-300)',
          400: 'var(--fui-primary-400)',
          500: 'var(--fui-primary-500)',
          600: 'var(--fui-primary-600)',
          700: 'var(--fui-primary-700)',
          800: 'var(--fui-primary-800)',
          900: 'var(--fui-primary-900)',
        },
        text: {
          primary: 'var(--fui-text-primary)',
          secondary: 'var(--fui-text-secondary)',
          error: 'var(--fui-text-error)',
        },
        bg: {
          primary: 'var(--fui-bg-primary)',
          secondary: 'var(--fui-bg-secondary)',
        },
      },
      spacing: {
        1: 'var(--fui-spacing-1)',
        2: 'var(--fui-spacing-2)',
        3: 'var(--fui-spacing-3)',
        4: 'var(--fui-spacing-4)',
        6: 'var(--fui-spacing-6)',
        8: 'var(--fui-spacing-8)',
      },
      borderRadius: {
        sm: 'var(--fui-radius-sm)',
        md: 'var(--fui-radius-md)',
        lg: 'var(--fui-radius-lg)',
      },
    },
  },
  plugins: [],
};
