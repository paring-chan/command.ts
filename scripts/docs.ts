/*
 * File: docs.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { runGenerator } from '@discordjs/ts-docgen'

runGenerator({
  existingOutput: 'docs/typedoc-out.json',
  custom: 'docs/index.yml',
  output: 'docs/docs.json',
})
