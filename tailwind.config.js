/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: theme => ({
        black: {
          light: "#222",
          DEFAULT: "#222",
          dark: "#FFF"
        },
      }),
      colors: theme => ({
        black: {
          light: "#222",
          DEFAULT: "#222",
          dark: "#FFF"
        },
      })
    },
  },
  plugins: [],
}
