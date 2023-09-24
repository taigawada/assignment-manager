module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-airbnb-with-typescript",
    "@vue/eslint-config-prettier",
  ],
  ignorePatterns: ["/materials"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "consistent-return": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "vuejs-accessibility/mouse-events-have-key-events": "off",
    "vuejs-accessibility/click-events-have-key-events": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
  },
};
