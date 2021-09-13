import { Module } from '../structures'
import { Message } from 'discord.js'
import { KCommandChecks } from '../constants'

export type Argument = {
  optional: boolean
  type: any
}

export type CheckFunction = (msg: Message) => boolean | Promise<boolean>

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
