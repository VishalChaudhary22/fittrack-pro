import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Core no-unused-vars does not track a capitalised binding rendered as
      // an element (`<Icon />`): it only counts Identifier references, not
      // JSXIdentifier ones. eslint-plugin-react is not installed, so the
      // capitalised naming convention stands in for that detection — `Icon`
      // destructured from a nav/services list is reported as unused otherwise.
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^[A-Z_]',
        argsIgnorePattern: '^[A-Z_]',
      }],
    },
  },
  {
    // One-off Node data-ingest scripts (they call `process`); not part of the
    // browser bundle.
    files: ['src/scripts/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])
