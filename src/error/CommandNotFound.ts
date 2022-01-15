import { Message } from 'discord.js'

export class CommandNotFound extends Error {
  constructor(public commandName: string, public msg: Message, public args: string[]) {
    super(`Command ${commandName} not found.`)
  }
}
