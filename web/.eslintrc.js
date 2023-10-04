export default {
  extends: ['mantine'],
  parserOptions: {
    project: './web/tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
