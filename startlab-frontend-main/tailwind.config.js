/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#363636",
          purple: "#3C00FF",
          lime: "#D9F63A",
          gray: "#101828",
          green: "#C5EB00",
          gray2: "#f1f2f6",
          milk: "#f6fbff",
          lite: {
            green: "#F9FFE4",
            purple: "#F5FBFF",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Arial"],
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 30px rgba(16, 24, 40, 0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
