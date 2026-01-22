/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'core-primary': {
          50: 'var(--core-primary-50)',
          100: 'var(--core-primary-100)',
          200: 'var(--core-primary-200)',
          300: 'var(--core-primary-300)',
          400: 'var(--core-primary-400)',
          500: 'var(--core-primary-500)',
          600: 'var(--core-primary-600)',
          700: 'var(--core-primary-700)',
          800: 'var(--core-primary-800)',
          900: 'var(--core-primary-900)',
        },
        'core-bg': {
          dark: 'var(--core-bg-dark)',
          light: 'var(--core-bg-light)',
        },
        'core-surface': {
          dark: 'var(--core-surface-dark)',
          light: 'var(--core-surface-light)',
        },
        'core-border': 'var(--core-border)',
        'core-text': {
          'primary-dark': 'var(--text-primary-dark)',
          'secondary-dark': 'var(--text-secondary-dark)',
          'primary-light': 'var(--text-primary-light)',
          'secondary-light': 'var(--text-secondary-light)',
        },
      },
      backgroundColor: {
        'primary': 'var(--bg-primary)',
        'secondary': 'var(--bg-secondary)',
      },
      textColor: {
        'primary': 'var(--text-primary)',
        'secondary': 'var(--text-secondary)',
        'muted': 'var(--text-muted)',
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
      borderRadius: {
        'dynamic': 'var(--border-radius)',
      },
      fontSize: {
        'dynamic': 'var(--font-size)',
      },
    },
  },
  plugins: [],
}