import { Message } from 'discord.js'

export class Context {
  constructor(public msg: Message, public prefix: string) {}
}
