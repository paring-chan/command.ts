/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

export class InvalidTargetError extends Error {
  constructor() {
    super('Class does not extend "Module" class.')
  }
}
