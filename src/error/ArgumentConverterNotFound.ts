import { Message } from 'discord.js'
import type { Argument } from '../command'

export class ArgumentConverterNotFound extends Error {
  constructor(public type: Argument, public msg: Message) {
    super(`Argument converter ${type.type.name} not found.`)
  }
}
