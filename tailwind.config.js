/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
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
        'nu-darkYellow': '#eab308',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [{
      light: {
        primary: "#35408E",
        "primary-content": "#f3f4f6",
        secondary: "#eab308",
        "neutral": "#111827",
        error: "#dc3545",
        "error-content": "#f3f4f6",
      },
    },],
  },
}

