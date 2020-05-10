module.exports = {
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
    ],
    rules: {
        '@typescript-eslint/camelcase': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'max-line-length': 0,
        'import-spacing-rule': 0,
    },
};
