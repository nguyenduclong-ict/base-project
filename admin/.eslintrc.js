module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': 0,
    'import/default': 0,
    'vue/require-valid-default-prop': 0,
    'vue/require-default-prop': 0,
    'vue/no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/no-v-html': 0,
    'standard/no-callback-literal': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-mutating-props': 0,
    eqeqeq: 0,
    camelcase: 0,
  },
}
