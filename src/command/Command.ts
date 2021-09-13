import { Module } from '../structures'
import { Message } from 'discord.js'

export type Argument = {
  optional: boolean
  type: any
}

export class Command {
  execute(module: Module, args: any[]) {
    return this.run.apply(module, args)
  }

  constructor(
    private run: Function,
    public argTypes: Argument[],
    public name: string,
    public aliases: string[] | ((msg: Message) => string[]),
  ) {}
}
