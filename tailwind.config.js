/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        thaired: "#e74644",
        thaiblue: "#295BD4", // now usable as text-thaired, bg-thaired, etc.
      },
    },
  },
  plugins: [],
};
