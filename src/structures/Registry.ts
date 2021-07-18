import { Module } from './Module'
import { Collection } from 'discord.js'
import { CommandManager } from '../command'
import { CommandClient } from './CommandClient'
import { ListenerManager } from '../listener'
import { SlashCommandManager } from '../slashCommand'

export class Registry {
  constructor(public client: CommandClient) {}

  modules: Collection<string, Module> = new Collection<string, Module>()
  commandManager = new CommandManager()
  slashCommandManager = new SlashCommandManager(this)
  listenerManager = new ListenerManager(this.client)

  async registerModule(module: Module) {
    if (this.modules.has(module.__path))
      throw new Error('Module already registered.')
    await module.load()
    this.modules.set(module.__path, module)
    this.listenerManager.register(module)
    this.commandManager.register(module)
    this.slashCommandManager.register(module)
  }

  async unregisterModule(modOrID: string | Module) {
    const key: string =
      typeof modOrID === 'string'
        ? modOrID
        : this.modules.findKey((x) => x.__path === modOrID.__path)!
    if (!key) throw new Error('Module not found or not registered.')
    const module = this.modules.get(key)!
    await module.unload()
    this.listenerManager.unregister(module)
    this.commandManager.unregister(module)
    this.slashCommandManager.unregister(module)
    this.modules.delete(key)
  }

  async loadModule(pathToModule: string) {
    const module = await import(pathToModule)
    if (typeof module.install !== 'function')
      throw new Error('install function not found.')
    const installResult = module.install(this.client)
    if (!(installResult instanceof Module))
      throw new Error('install function returned invalid result.')
    await this.registerModule(installResult)
  }

  async unloadModule(module: Module) {
    await this.unregisterModule(module)
    delete require.cache[module.__path]
  }

  async reloadModule(module: Module) {
    const path = module.__path
    await this.unloadModule(module)
    await this.loadModule(path)
  }
}
