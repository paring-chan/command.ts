import { Command } from '../types'

export class CheckFailedError extends Error {
  constructor(public command: Command) {
    super()
  }
}
