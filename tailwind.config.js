/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,vue}",
    "./public/**/*.html"
  ],
  darkMode: 'class', // Habilita el modo oscuro usando clases
  theme: {
    extend: {
      screens: {
        'xs': '480px',      // Phones boundary
        'sm': '640px',      // Tailwind default
        'md': '768px',      // Small Tablet
        'lg': '1024px',     // Big Tablet boundary
        'xl': '1366px',     // Laptop
        '2xl': '1920px',    // Desktop
      },
    },
  },
  plugins: [],
};
