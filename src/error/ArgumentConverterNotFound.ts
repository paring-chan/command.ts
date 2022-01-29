/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { CommandInteraction, ContextMenuInteraction, Message } from 'discord.js'
import type { Argument } from '../command'
import type { AppCommandArgument } from '../applicationCommand'

export class ArgumentConverterNotFound extends Error {
  constructor(public type: Argument, public msg: Message) {
    super(`Argument converter ${type.type.name} not found.`)
  }
}
export class ApplicationCommandArgumentConverterNotFound extends Error {
  constructor(public type: AppCommandArgument, public interaction: CommandInteraction | ContextMenuInteraction) {
    super(`Argument converter ${type.type.name} not found.`)
  }
}
