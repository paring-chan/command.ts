import { Module } from '../structures'
import { Message } from 'discord.js'

type Argument = {
  optional: boolean
  type: any
}

export class Command {
  execute(args: string[]) {
    return this.run.call(this.module, args)
  }

  constructor(
    public module: Module,
    private run: Function,
    public argTypes: Argument[],
    public name: string,
    public aliases: string[] | ((msg: Message) => string[]),
  ) {}
}
