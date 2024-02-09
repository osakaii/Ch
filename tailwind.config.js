/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#d17034",
        white: "#fae1bc",
      },
    },
  },
  plugins: [],
};
