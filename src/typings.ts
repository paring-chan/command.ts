import type { Command } from './command'
import { CommandClient } from './structures'
import { SlashCommand } from './slashCommand'

declare module 'discord.js' {
  interface Message {
    data: {
      command: Command | null
      prefix: string
      cts: CommandClient
    }
  }
  interface CommandInteraction {
    data: {
      command: SlashCommand
      cts: CommandClient
    }
  }
}
