/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

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
  interface MessageComponentInteraction {
    data: {
      command: AppCommand
      cts: CommandClient
    }
  }
}
