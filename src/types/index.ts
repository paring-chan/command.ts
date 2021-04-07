import { Module } from '../structures'
import { Message } from 'discord.js'

export type CommandClientOptions = {
  owners: string[] | 'auto'
  prefix: string
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
}

export interface ICommandDecoratorMetadata {
  args: ICommandArgument[]
  usesCtx: boolean
  key: string
}

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
