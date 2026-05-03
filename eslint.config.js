// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tseslint = require('typescript-eslint');
const pluginQuery = require('@tanstack/eslint-plugin-query');
const prettierConfig = require('eslint-config-prettier/flat');
const a11yPlugin = require('./scripts/eslint-plugin-tribes-a11y');

module.exports = defineConfig([
  expoConfig,
  ...tseslint.configs.recommendedTypeChecked,
  ...pluginQuery.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      'tribes-a11y': a11yPlugin,
    },
    rules: {
      // RN's surface (require() for assets, untyped 3rd-party APIs) makes the
      // unsafe-* family too noisy to be useful. Downgrade to warnings so they
      // surface in editors but don't block.
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      // High-signal rules stay as errors:
      // - no-floating-promises (forgotten awaits)
      // - no-misused-promises (async fn passed where void expected)
      // - require-await, await-thenable, etc. (typescript-eslint defaults)
      'tribes-a11y/min-touch-target': 'error',
    },
  },
  {
    // Node CommonJS scripts (build/config files): no type-checking, allow require/__dirname.
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
]);
