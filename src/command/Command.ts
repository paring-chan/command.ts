import { Module } from '../structures'
import { CommandInteraction, Message } from 'discord.js'
import { KCommandChecks } from '../constants'

export type Argument = {
  optional: boolean
  type: any
  rest: boolean
}

export type CheckFunction = (msg: Message) => boolean | Promise<boolean>
export type SlashCheckFunction = (i: CommandInteraction) => boolean | Promise<boolean>

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
    public aliases: string[] | ((msg: Message) => string[]),
    public module: Module,
    public key: symbol | string,
  ) {}
}
