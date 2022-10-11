module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  parser: 'vue-eslint-parser',
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-undef': 'off',
    'vue/no-mutating-props': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'vue/no-multiple-template-root': 'off',
    'vue/multi-word-component-names': 'off',
    'no-mutating-props': 'off',
    'vue/no-v-html': 'off',
    'vue/no-setup-props-destructure': 'off',
    '@typescript-eslint/no-unused-vars': 'off'
  }
}
