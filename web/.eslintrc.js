module.exports = {
  extends: ['mantine'],
  parserOptions: {
    project: './web/tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  ignorePatterns: ['.eslintrc.js'],
};
