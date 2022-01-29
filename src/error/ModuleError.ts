/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

export class ModuleLoadError extends Error {
  constructor(file: string, public error: Error) {
    super('Failed to load module ' + file)
  }
}

export class InvalidModuleError extends Error {}
