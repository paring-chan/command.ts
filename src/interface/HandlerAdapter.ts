import type { Snowflake } from 'discord.js'
import { CommandClient } from '../structures'

export type CommandHandlerResult<MSG> = {
  message: MSG
  content: string
  author: Snowflake
}

export interface HandlerAdapter<MSG> {
  getCommandData(msg: MSG): CommandHandlerResult<MSG>
  init(client: CommandClient): void
  fetchOwners(): string[] | Promise<string[]>
}
