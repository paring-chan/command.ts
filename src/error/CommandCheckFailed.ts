import { CommandInteraction, Message } from 'discord.js'
import { Command } from '../command'
import { SlashCommand } from '../slashCommand'

export class CommandCheckFailed extends Error {
  constructor(public msg: Message, public command: Command) {
    super()
  }
}

export class SlashCommandCheckFailed extends Error {
  constructor(public interaction: CommandInteraction, public command: SlashCommand) {
    super()
  }
}
