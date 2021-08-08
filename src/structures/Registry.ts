import { Module } from './Module'
import { Collection } from 'discord.js'
import { CommandManager } from '../command'
import { CommandClient } from './CommandClient'
import { ListenerManager } from '../listener'
import { SlashCommandManager } from '../slashCommand'
import path from 'path'

/**
 * Registry class to store commands/listeners
 */
export class Registry {
  constructor(public client: CommandClient) {}

  /**
   * Module collection by id
   */
  modules: Collection<string, Module> = new Collection<string, Module>()
  /**
   * Command manager instance
   */
  commandManager = new CommandManager()
  /**
   * Slash command manager instance
   */
  slashCommandManager = new SlashCommandManager(this)
  /**
   * Listener manager instance
   */
  listenerManager = new ListenerManager(this.client)

  /**
   * Register module instance
   * @param module
   */
  async registerModule(module: Module) {
    if (this.modules.has(module.__path))
      throw new Error('Module already registered.')
    await module.load()
    this.modules.set(module.__path, module)
    this.listenerManager.register(module)
    this.commandManager.register(module)
    this.slashCommandManager.register(module)
  }

  /**
   * Unregister module by ID or Module instance
   * @param modOrID
   */
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

  /**
   * Load Module from file path
   * @param pathToModule
   * @param absolute
   */
  async loadModule(pathToModule: string, absolute = false) {
    const module = await import(
      absolute ? pathToModule : path.join(this.client.rootPath, pathToModule)
    )
    if (typeof module.install !== 'function')
      throw new Error('install function not found.')
    const installResult = module.install(this.client)
    if (!(installResult instanceof Module))
      throw new Error('install function returned invalid result.')
    module.loaded = true
    await this.registerModule(installResult)
  }

  /**
   * Unload Module which is loaded by `loadModule`
   * @param module
   */
  async unloadModule(module: Module) {
    if (!require(module.__path).loaded) {
      throw new Error('Not loaded with loadModule.')
    }
    await this.unregisterModule(module)
    delete require.cache[module.__path]
  }

  /**
   * Reload Module by passing module instance.
   * @param module
   */
  async reloadModule(module: Module) {
    const path = module.__path
    if (!require(path).loaded) {
      throw new Error('Not loaded with loadModule.')
    }
    await this.unloadModule(module)
    await this.loadModule(path, true)
  }
}
