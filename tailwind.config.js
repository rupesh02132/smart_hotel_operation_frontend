/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        accent: "#ec4899",
        dark: "#020617",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
        soft: "0 4px 20px rgba(0,0,0,0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};