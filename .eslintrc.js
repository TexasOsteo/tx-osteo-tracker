module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:prettier/recommended'],
  plugins: [],
  rules: {
    'vue/no-multiple-template-root': 0,
    'prettier/prettier': 1,
    '@typescript-eslint/no-unused-vars': 1,
    'no-useless-return': 0,
  },
}
