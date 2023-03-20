module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
      screens: {
        sm: "1000px",
        "2xl": "1600px",
      },
    },
  },
  variants: {
    extend: {},
    opacity: ({ after }) => after(["disabled"]),
  },
  plugins: [],
};
