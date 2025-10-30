/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'mfe-company-',
  content: ["./projects/company/src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}

