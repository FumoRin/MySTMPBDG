module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Added jsx, ts, and tsx
  theme: {
    extend: {
      colors: {
        calypsoDark: {
          0: "#29647c", // 0%
          100: "#255a70", // 10%
          200: "#215063", // 20%
          300: "#1d4657", // 30%
          400: "#193c4a", // 40%
          500: "#15332e", // 50%
          600: "#102832", // 60%
          700: "#0c1e25", // 70%
          800: "#081419", // 80%
          900: "#040a0c", // 90%
          1000: "#000000", // 100%
        },
        calypsoLight: {
          100: "#3e7489", // lighter 10%
          200: "#548396", // lighter 20%
          300: "#6993a3", // lighter 30%
          400: "#7fa2b0", // lighter 40%
          500: "#94b2be", // lighter 50%
          600: "#a9c1cb", // lighter 60%
          700: "#bfd1d8", // lighter 70%
          800: "#d4e0e5", // lighter 80%
          900: "#eaf0f2", // lighter 90%
          1000: "#ffffff", // 100%
        },
      },
    },
  },
  plugins: [],
};
