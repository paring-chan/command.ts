export class ModuleLoadError extends Error {
  constructor(file: string, public error: Error) {
    super('Failed to load module ' + file)
  }
}

export class InvalidModuleError extends Error {}
