import { Module } from './Module'
import { Collection } from 'discord.js'
import { CommandManager } from './CommandManager'
import { CommandClient } from './CommandClient'
import { ListenerManager } from './ListenerManager'

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Collection<string, Module> = new Collection<string, Module>()
  commandManager = new CommandManager()
  listenerManager = new ListenerManager(this.client)

  registerModule(id: string, module: Module) {
    this.modules.set(id, module)
    this.listenerManager.register(module)
    this.commandManager.register(module)
  }
}
