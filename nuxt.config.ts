// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    AUTH0_DOMAIN: ensureEnv('AUTH0_DOMAIN'),
    AUTH0_CLIENTID: ensureEnv('AUTH0_CLIENTID'),
    AUTH0_SECRET: ensureEnv('AUTH0_SECRET'),
    public: {
      auth0_token: 'txosteo_volunteer_auth0_token',
      txosteo_token: 'txosteo_volunteer_token',
    },
  },
  modules: ['@formkit/nuxt'],
  formkit: {
    autoImport: true,
  },
  app: {
    head: {
      title: 'Volunteer At Texas Osteoporosis Foundation',
    },
  },
})

function ensureEnv(envName: string): string {
  if (!process || !process.env) {
    throw new Error(
      'Attempted to get environment variable from client. This should not happen',
    )
  }
  const value = process.env[envName]
  if (!value) {
    throw new Error(
      `Missing environment variable "${envName}." Please define it in .env`,
    )
  }
  return value
}
