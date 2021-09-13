import { Message } from 'discord.js'

export class ArgumentNotProvided extends Error {
  constructor(public index: number, public msg: Message) {
    super(`Required argument #${index} not provided.`)
  }
}
