// import js from '@eslint/js';
// import { includeIgnoreFile } from '@eslint/compat';
// import svelte from 'eslint-plugin-svelte';
// import globals from 'globals';
// import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
// const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

import config from "@mono/shared/eslint.config";

export default config()
