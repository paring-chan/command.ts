import { Module } from './Module'
import { Collection } from 'discord.js'
import { CommandManager } from './CommandManager'

export class Registry {
  modules: Collection<string, Module> = new Collection<string, Module>()
  commandManager = new CommandManager()

  registerModule(id: string, module: Module) {
    this.modules.set(id, module)
  }
}
