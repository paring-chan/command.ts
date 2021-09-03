export class InvalidTargetError extends Error {
  constructor() {
    super('Class does not extend "Module" class.')
  }
}
