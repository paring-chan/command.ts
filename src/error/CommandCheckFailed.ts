/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { CommandInteraction, ContextMenuInteraction, Message, MessageComponentInteraction } from 'discord.js'
import { Command } from '../command'
import { AppCommand } from '../applicationCommand'

export class CommandCheckFailed extends Error {
  constructor(public msg: Message, public command: Command) {
    super()
  }
}

export class ApplicationCommandCheckFailed extends Error {
  constructor(public interaction: CommandInteraction | MessageComponentInteraction | ContextMenuInteraction, public command: AppCommand) {
    super()
  }
}
