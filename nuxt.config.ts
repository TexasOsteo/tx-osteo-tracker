// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  alias: {
    // catch and import dynamically every file in the project -AS
    '@': resolve(__dirname, './'),
    '~': resolve(__dirname, './'),
  },
})
