import { Module } from '../structures'
import { CommandInteraction, Message } from 'discord.js'

export class ArgumentConverter {
  execute(module: Module, msg: Message, arg?: string) {
    return this.run.apply(module, [msg, arg])
  }

  constructor(public type: object, private run: Function, public withoutParameter: boolean) {}
}

export class SlashArgumentConverter {
  execute(module: Module, interaction: CommandInteraction) {
    return this.run.apply(module, [interaction])
  }

  constructor(public type: object, private run: Function) {}
}
