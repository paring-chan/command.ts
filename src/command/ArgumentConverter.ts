import { Module } from '../structures'
import { Message } from 'discord.js'

export class ArgumentConverter {
  execute(msg: Message, arg: string) {
    return this.run.call(this.module, [arg, msg])
  }

  constructor(
    public module: Module,
    public type: object,
    private run: Function,
  ) {}
}
