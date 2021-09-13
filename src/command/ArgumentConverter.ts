import { Module } from '../structures'
import { Message } from 'discord.js'

export class ArgumentConverter {
  execute(module: Module, msg: Message, arg?: string) {
    return this.run.apply(module, [msg, arg])
  }

  constructor(public type: object, private run: Function, public withoutParameter: boolean) {}
}
