import { CommandInteraction } from 'discord.js'

export class SlashCommandGlobalCheckError extends Error {
  constructor(public i: CommandInteraction) {
    super('Slash command before-run check failed.')
  }
}
