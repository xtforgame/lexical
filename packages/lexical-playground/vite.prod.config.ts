/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import {defineConfig} from 'vite';
import {replaceCodePlugin} from 'vite-plugin-replace';

import moduleResolution from '../shared/viteModuleResolution';
import viteCopyEsm from './viteCopyEsm';
import viteCopyExcalidrawAssets from './viteCopyExcalidrawAssets';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    outDir: 'build',
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
      },
      onwarn(warning, warn) {
        if (
          warning.code === 'EVAL' &&
          warning.id &&
          /[\\/]node_modules[\\/]@excalidraw\/excalidraw[\\/]/.test(warning.id)
        ) {
          return;
        }
        warn(warning);
      },
    },
    terserOptions: {
      compress: {
        toplevel: true,
      },
      keep_classnames: true,
    },
  },
  define: {
    'process.env.IS_PREACT': process.env.IS_PREACT,
  },
  plugins: [
    react(),
    commonjs({
      // This is required for React 19 (at least 19.0.0-beta-26f2496093-20240514)
      // because @rollup/plugin-commonjs does not analyze it correctly
      strictRequires: [/\/node_modules\/(react-dom|react)\/[^/]\.js$/],
    }),
  ],
  resolve: {
    alias: {
      'shared': path.resolve('..', 'shared/src'),
    },
  },
});
