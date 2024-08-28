/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nu-blue': '#35408E',
        'nu-yellow': '#FFE469',
      },
    },
  },
  plugins: [],
}

