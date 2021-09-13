export class CommandNotFound extends Error {
  constructor(public commandName: string) {
    super(`Command ${commandName} not found.`)
  }
}
