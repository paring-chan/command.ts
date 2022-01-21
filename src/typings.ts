import type { Command } from './command'
import { CommandClient } from './structures'
import { AppCommand } from './applicationCommand'

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
      command: AppCommand
      cts: CommandClient
    }
  }
}
