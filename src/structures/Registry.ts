import { Module } from './Module'
import { Collection } from 'discord.js'
import { CommandManager } from '../command'
import { CommandClient } from './CommandClient'
import { ListenerManager } from '../listener'

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Collection<string, Module> = new Collection<string, Module>()
  commandManager = new CommandManager()
  listenerManager = new ListenerManager(this.client)

  async registerModule(id: string, module: Module) {
    if (this.modules.has(id)) throw new Error('Module already registered.')
    await module.load()
    this.modules.set(id, module)
    this.listenerManager.register(module)
    this.commandManager.register(module)
  }

  async unregisterModule(modOrID: string | Module) {
    const key: string =
      typeof modOrID === 'string'
        ? modOrID
        : this.modules.findKey((x) => x === modOrID)!
    if (!key) throw new Error('Module not found or not registered.')
    const module = this.modules.get(key)!
    await module.unload()
    this.listenerManager.unregister(module)
    this.commandManager.unregister(module)
  }
}
