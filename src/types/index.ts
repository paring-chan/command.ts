import { Module } from '../structures'
import {
  ApplicationCommandOptionData,
  Message,
  PermissionResolvable,
  Snowflake,
} from 'discord.js'

export type CommandClientOptions = {
  owners: Snowflake[] | 'auto'
  prefix: string | ((msg: Message) => string | Promise<string>)
  slashCommands: {
    autoRegister: boolean
  } & (
    | {
        guild: Snowflake | Snowflake[]
      }
    | {
        ownerCommandGuild: Snowflake
      }
  )
  commands: {
    allowSelf: boolean
    allowBots: boolean
  }
}

export interface ICommandDecoratorOptions {
  aliases: string[]
  brief?: string
  description?: string
  name: string
}

export interface ICommandArgument {
  type: Function
  optional: boolean
  rest: boolean
}

export interface ICommandDecoratorMetadata {
  args: ICommandArgument[]
  usesCtx: boolean
  key: string
}

export interface ISlashCommandDecoratorMetadata {
  options: ApplicationCommandOptionData[]
  key: string
}

export interface ISlashCommandArgument {
  type: Function
}

export interface ICommandArgument {
  type: Function
  optional: boolean
  rest: boolean
}

export interface ISlashCommandDecoratorOptions {
  name: string
  options: ApplicationCommandOptionData[]
  description: string
}

export type ISlashCommandDecorator = ISlashCommandDecoratorMetadata &
  ISlashCommandDecoratorOptions

export type ICommandDecorator = ICommandDecoratorOptions &
  ICommandDecoratorMetadata

export interface Command {
  execute: Function
  args: ICommandArgument[]
  name: string
  aliases: string[]
  description?: string
  brief?: string
  usesCtx: boolean
  module: Module
  ownerOnly: boolean
  checks: CheckFunction[]
  userPermissions?: PermissionResolvable
  clientPermissions?: PermissionResolvable
}

export interface SlashCommand {
  execute: Function
  name: string
  description: string
  module: Module
  options: ApplicationCommandOptionData[]
  ownerOnly: boolean
  checks: CheckFunction[]
  userPermissions?: PermissionResolvable
  clientPermissions?: PermissionResolvable
}

export interface IListener {
  event: string
  id: string
}

export type ListenerDecorator = IListener & {
  key: string
}

export type Listener = IListener & {
  wrapper: (...args: any[]) => any
  module: Module
}

export interface IArgConverterDecorator {
  type: Function
  key: string
}

export interface ArgConverter {
  type: Function
  convert: (arg: string, msg: Message) => any
  module: Module
}

export type CheckFunction = (msg: Message) => boolean | Promise<boolean>

export type RequiredPermissions = {
  permissions: PermissionResolvable
}
