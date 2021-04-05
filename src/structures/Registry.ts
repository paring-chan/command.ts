import { Module } from './Module'
import { Collection } from 'discord.js'

export class Registry {
  modules: Collection<string, Module> = new Collection<string, Module>()

  registerModule(id: string, module: Module) {
    this.modules.set(id, module)
  }
}
