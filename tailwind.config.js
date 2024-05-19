/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        tertiary: 'var(--tertiary-color)',
        backgroundStart: 'var(--background-start-rgb)',
        backgroundEnd: 'var(--background-end-rgb)',
        foreground: 'var(--foreground-rgb)',
        sidebarBg: 'var(--sidebar-bg)',
        sidebarText: 'var(--sidebar-text)',
        darkPrimary: 'var(--dark-primary-color)',
        darkSecondary: 'var(--dark-secondary-color)',
        darkTertiary: 'var(--dark-tertiary-color)',
        darkBackgroundStart: 'var(--dark-background-start-rgb)',
        darkBackgroundEnd: 'var(--dark-background-end-rgb)',
        darkForeground: 'var(--dark-foreground-rgb)',
        darkSidebarBg: 'var(--dark-sidebar-bg)',
        darkSidebarText: 'var(--dark-sidebar-text)',
      }
    },
  },
  plugins: [],
};
