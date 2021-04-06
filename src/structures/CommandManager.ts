import { Module } from './Module'
import { Collection } from 'discord.js'
import { Command, ICommandDecorator } from '../types'
import { COMMANDS_KEY } from '../constants'

export class CommandManager {
  commands: Collection<Module, Command[]> = new Collection()

  register(module: Module) {
    const decorators: ICommandDecorator[] = Reflect.getMetadata(
      COMMANDS_KEY,
      module,
    )
    if (!decorators) return
    const commands: Command[] = decorators.map((v, k) => ({
      usesCtx: v.usesCtx,
      args: v.args,
      brief: v.brief,
      description: v.description,
      module: module,
      name: v.name,
      // @ts-ignore
      execute: module[v.key],
    }))
    this.commands.set(module, commands)
  }

  unregister(module: Module) {
    this.commands.delete(module)
  }
}
