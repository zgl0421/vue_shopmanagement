module.exports = {
    root: true,
    env: {
        node: true
    },
    
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    "plugins": [
        "vue"
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        "indent": ["off", 2],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        "space-before-function-paren": 0,
        "comma-dangle": 0,
        "vue/no-unused-vars": 0,
        "spaced-comment": 0
    }
}