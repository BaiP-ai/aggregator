/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Matching the primary color from the main website
        secondary: '#7C3AED', // Purple accent color
        accent: '#8b5cf6',
        dark: '#111827',
        light: '#f3f4f6'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 15px 5px rgba(37, 99, 235, 0.4)', // Added for button hover effect
      }
    },
  },
  plugins: [],
}
