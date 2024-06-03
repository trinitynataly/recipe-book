/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Tailwind CSS configuration file for the Recipe Book application.
*/

/** @type {import('tailwindcss').Config} */
// Define Tailwind CSS configuration object
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [ // Define the content paths
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Define the pages path
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Define the components path
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Define the app path
  ],
  // Extend the Tailwind CSS theme
  theme: {
    extend: {
      // Define the custom background image gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // Define the custom
      colors: {
        primary: 'var(--primary-color)', // Define the primary color
        secondary: 'var(--secondary-color)', // Define the secondary color
        tertiary: 'var(--tertiary-color)', // Define the tertiary color
        backgroundStart: 'var(--background-start-rgb)', // Define the background start color
        backgroundEnd: 'var(--background-end-rgb)', // Define the background end color
        foreground: 'var(--foreground-rgb)', // Define the foreground color
        sidebarBg: 'var(--sidebar-bg)', // Define the sidebar background color
        sidebarText: 'var(--sidebar-text)', // Define the sidebar text color
        darkPrimary: 'var(--dark-primary-color)', // Define the dark primary color
        darkSecondary: 'var(--dark-secondary-color)', // Define the dark secondary color
        darkTertiary: 'var(--dark-tertiary-color)', // Define the dark tertiary color
        darkBackgroundStart: 'var(--dark-background-start-rgb)', // Define the dark background start color
        darkBackgroundEnd: 'var(--dark-background-end-rgb)', // Define the dark background end color
        darkForeground: 'var(--dark-foreground-rgb)', // Define the dark foreground color
        darkSidebarBg: 'var(--dark-sidebar-bg)', // Define the dark sidebar background color
        darkSidebarText: 'var(--dark-sidebar-text)', // Define the dark sidebar text color
      }
    },
  },
  // Extend the Tailwind CSS plugins
  plugins: [
    require('@tailwindcss/typography'), // Use the Typography plugin
  ],
};
