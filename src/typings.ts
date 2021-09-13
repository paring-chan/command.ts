import type { Command } from './command'
import { CommandClient } from './structures'

declare module 'discord.js' {
  interface Message {
    data: {
      command: Command
      prefix: string
      cts: CommandClient
    }
  }
}
