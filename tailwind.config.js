/** @type {import('tailwindcss').Config} */
<<<<<<< Updated upstream
export default {
  content: [],
=======
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
>>>>>>> Stashed changes
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = {
  //...
  plugins: [
    require('daisyui'),
  ],
}