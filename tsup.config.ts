/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  splitting: false,
  clean: true,
  dts: true,
  minify: true,
})
