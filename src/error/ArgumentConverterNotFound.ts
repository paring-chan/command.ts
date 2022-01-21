import { CommandInteraction, Message } from 'discord.js'
import type { Argument } from '../command'
import type { SlashArgument } from '../applicationCommand'

export class ArgumentConverterNotFound extends Error {
  constructor(public type: Argument, public msg: Message) {
    super(`Argument converter ${type.type.name} not found.`)
  }
}
export class SlashArgumentConverterNotFound extends Error {
  constructor(public type: SlashArgument, public interaction: CommandInteraction) {
    super(`Argument converter ${type.type.name} not found.`)
  }
}
