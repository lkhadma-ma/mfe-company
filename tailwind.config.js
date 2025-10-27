/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'mfe-company-',
  content: ["./projects/user/src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

