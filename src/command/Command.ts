/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Module } from '../structures'
import { CommandInteraction, ContextMenuInteraction, Message, MessageComponentInteraction } from 'discord.js'
import { KCommandChecks } from '../constants'

export type Argument = {
  optional: boolean
  type: any
  rest: boolean
}

export type CheckFunction = (msg: Message) => boolean | Promise<boolean>
export type ApplicationCommandCheckFunction = (i: CommandInteraction | MessageComponentInteraction | ContextMenuInteraction) => boolean | Promise<boolean>

export class Command {
  execute(module: Module, args: any[]) {
    return this.run.apply(module, args)
  }

  get checks(): CheckFunction[] {
    return Reflect.getMetadata(KCommandChecks, this.module, this.key) || []
  }

  constructor(
    private run: Function,
    public argTypes: Argument[],
    public name: string,
    public aliases: string[] | ((msg: Message) => string[] | Promise<string[]>),
    public module: Module,
    public key: symbol | string,
  ) {}
}
