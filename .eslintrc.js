module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: [
    'html'
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['vue'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-console': 'off',
    'indent': ['error', 4]
  }
}
