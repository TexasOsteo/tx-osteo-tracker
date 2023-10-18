/* eslint-disable @typescript-eslint/no-var-requires */
const FormKitVariants = require('@formkit/themes/tailwindcss')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './assets/*.{js,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [FormKitVariants],
}
