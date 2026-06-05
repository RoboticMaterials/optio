import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
    js.configs.recommended,

    // Test files
    {
        files: ['src/**/*.test.js', 'src/**/*.spec.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: { ...globals.browser, ...globals.jest },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
    },

    // Node scripts
    {
        files: ['scripts/**/*.js', 'vite.config.js'],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    // All source files
    {
        files: ['src/**/*.js', 'src/**/*.jsx'],
        ignores: ['src/**/*.style.js', 'src/**/*.test.js', 'src/**/*.spec.js'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            // Critical: catches the return [] / conditional hooks bugs
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // Catches duplicate keys like wip: [] silently overwriting wip: {total,data}
            'no-dupe-keys': 'error',

            // Catches console.log left in production code
            'no-console': 'warn',

            // Prefer === over ==
            'eqeqeq': ['warn', 'always', { 'null': 'ignore' }],

            // Warn on clearly unused local vars; ignore _ prefix convention and args
            'no-unused-vars': ['warn', {
                varsIgnorePattern: '^_',
                argsIgnorePattern: '^_',
                caughtErrors: 'none',
            }],

            // React
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/prop-types': 'off',
            'react/display-name': 'off',

            // Turn off no-undef for JSX files — too many false positives from
            // styled-components, d3, and module patterns not using ESM imports
            'no-undef': 'off',
        },
    },
]
