import { Message } from 'discord.js'
import { Command } from '../command'

export class CommandCheckFailed extends Error {
  constructor(public msg: Message, public command: Command) {
    super()
  }
}
