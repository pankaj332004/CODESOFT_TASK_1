/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1288e8',
          dark: '#0876d8',
          light: '#eaf4fd',
        },
        success: {
          DEFAULT: '#08cf72',
          dark: '#06b262',
          light: '#e6faf1',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
        brandtext: {
          DEFAULT: '#17324f',
          light: '#475569',
        },
        brandmuted: {
          DEFAULT: '#718096',
          light: '#94a3b8',
        },
        brandbg: '#f6f9fc',
        brandborder: '#e6edf4',
      },
      borderRadius: {
        brand: '7px',
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px -2px rgba(23, 50, 79, 0.08)',
        hover: '0 14px 28px rgba(18, 136, 232, 0.12), 0 10px 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
