const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        black: "#262a33",
        white: "#00ac8e",
        slate: {
          100: "#00b68f",
          200: "#1bd0a6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        mono: ["var(--font-source-code-pro)", ...fontFamily.mono],
      },
    },
  },
  plugins: [require("daisyui")],
};
