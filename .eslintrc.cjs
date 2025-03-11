module.exports = {
  extends: 'standard',
  rules: {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'line-comment-position': ['error', { position: 'above' }],
    'padded-blocks': 'off',
    semi: ['error', 'always'],
    'operator-linebreak': ['error', 'before'],
    // So we can create ES6 code using template strings in JavaScript strings :p
    'no-template-curly-in-string': 'off',
  },
  globals: {
    fetch: true,
    Event: true,
    EventTarget: true,
    AbortController: true,
  },
};
