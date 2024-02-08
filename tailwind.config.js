/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import spacing from "tailwindcss/spacing";

export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
      dark: "#d17034",
      white: "#fae1bc",
    },

    extend: {},
  },
  plugins: [],
};
