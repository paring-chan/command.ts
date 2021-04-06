import { Module } from '../structures'

export type CommandClientOptions = {
  owners?: string[] | 'auto'
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
  description?: string
  brief?: string
  usesCtx: boolean
  module: Module
}
