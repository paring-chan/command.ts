import { Message } from 'discord.js'

/**
 * Command Context class
 */
export class Context {
  constructor(public msg: Message, public prefix: string) {}
}
