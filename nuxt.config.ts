import mjml from 'vite-plugin-mjml'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: process.env.DISABLE_NUXT_DEVTOOLS !== 'true',
  },
  css: ['~/assets/css/main.css', 'vue-final-modal/style.css'],
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
    AZURE_CDN_ORIGIN: ensureEnv('AZURE_CDN_ORIGIN'),
    AZURE_STORAGE_ACCOUNT_NAME: ensureEnv('AZURE_STORAGE_ACCOUNT_NAME'),
    AZURE_STORAGE_SHARED_KEY: ensureEnv('AZURE_STORAGE_SHARED_KEY'),
    OVERRIDE_HOST: process?.env?.OVERRIDE_HOST ?? '', // Optional
    AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING: ensureEnv(
      'AZURE_COMMUNICATION_SERVICE_CONNECTION_STRING',
    ),
    public: {
      auth0_token: 'txosteo_volunteer_auth0_token',
      txosteo_token: 'txosteo_volunteer_token',
    },
  },

  modules: [
    '@formkit/nuxt',
    '@pinia/nuxt',
    'nuxt-icon',
    // ['@nuxtjs/google-fonts', { families: { Inter: [400, 500, 600, 700] } }],
  ],
  formkit: {
    autoImport: true,
  },
  app: {
    head: {
      title: 'Volunteer At Texas Osteoporosis Foundation',
    },
  },
  watch: [/.+\.mjml/], // Needed since watch for mjml plugin doesn't work
  vite: {
    plugins: [
      mjml({
        input: 'server/assets/mjml',
        output: 'server/assets/mjml/rendered',
        extension: '.html',
        watch: true,
        mjml: {
          filePath: './server/assets/mjml',
        },
      }),
    ],
  },
})

function ensureEnv(envName: string): string {
  if (!process || !process.env) {
    throw new Error(
      'Attempted to get environment variable from client. This should not happen',
    )
  }
  const value = process.env[envName]
  if (process.env.DISABLE_ENV_CHECKING === 'true') return value!
  if (!value) {
    throw new Error(
      `Missing environment variable "${envName}." Please define it in .env`,
    )
  }
  return value
}
