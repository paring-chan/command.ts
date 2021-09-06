export class ModuleLoadError extends Error {
  constructor(file: string) {
    super('Failed to load module ' + file)
  }
}

export class InvalidModuleError extends Error {}
