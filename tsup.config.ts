/*
* File: tsup.config.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
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
