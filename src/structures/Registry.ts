import { CommandClient } from './CommandClient'
import { Module } from './Module'
import { Command, SlashArgumentConverter } from '../command'
import { KBuiltInModule, KListenerExecuteCache, KModulePath } from '../constants'
import path from 'path'
import { InvalidModuleError, InvalidTargetError, ModuleLoadError } from '../error'
import { Collection, Guild } from 'discord.js'
import walkSync from 'walk-sync'
import { ArgumentConverter } from '../command'
import { AppCommand } from '../applicationCommand'
import * as fs from 'fs'
import { MessageComponentHandler } from '../messageComponents/base'

type ListenerExecutor = {
  event: string
  execute: any
}

export class Registry {
  constructor(public client: CommandClient) {}

  modules: Collection<symbol, Module> = new Collection()

  private get logger() {
    return this.client.logger.getChildLogger({
      name: 'Registry',
    })
  }

  get commands(): Command[] {
    const result: Command[] = []

    for (const [, module] of this.modules) {
      result.push(...module.commands)
    }

    return result
  }

  get argumentConverters(): ArgumentConverter[] {
    const result: ArgumentConverter[] = []

    for (const [, module] of this.modules) {
      result.push(...module.argumentConverters)
    }

    return result
  }

  get slashArgumentConverters(): SlashArgumentConverter[] {
    const result: SlashArgumentConverter[] = []

    for (const [, module] of this.modules) {
      result.push(...module.slashArgumentConverters)
    }

    return result
  }

  get slashCommands(): AppCommand[] {
    const result: AppCommand[] = []

    for (const [, module] of this.modules) {
      result.push(...module.slashCommands)
    }

    return result
  }

  get messageComponentHandlers(): MessageComponentHandler[] {
    const result: MessageComponentHandler[] = []

    for (const [, module] of this.modules) {
      result.push(...module.messageComponentHandlers)
    }

    return result
  }

  registerModule(module: Module) {
    module.commandClient = this.client

    this.modules.set(Symbol(module.constructor.name), module)

    const list: ListenerExecutor[] = []

    for (const listener of module.listeners) {
      const bound = listener.execute.bind(module)
      list.push({ event: listener.name, execute: bound })
      this.client.client.on(listener.name, bound)
    }

    Reflect.defineMetadata(KListenerExecuteCache, list, module)

    return module
  }

  async loadModulesIn(dir: string, absolute = false) {
    let p = absolute ? dir : path.join(require.main!.path, dir)

    for (const i of walkSync(p)) {
      if (fs.lstatSync(path.join(p, i)).isFile()) {
        if (i.endsWith('.map')) continue
        await this.loadModule(path.join(p, i), true)
      }
    }
  }

  async loadModule(file: string, absolute: boolean = false) {
    let p = absolute ? file : path.join(require.main!.path, file)

    let m

    try {
      m = require(p)
    } catch (e: any) {
      throw new ModuleLoadError(p, e)
    }

    if (m.loaded) throw new Error('MODULE_ALREADY_LOADED')

    if (!m.install) throw new InvalidModuleError('Install function not found.')

    const mod = m.install(this.client)

    if (!(mod instanceof Module)) throw new InvalidTargetError()

    Reflect.defineMetadata(KModulePath, require.resolve(p), mod)

    this.registerModule(mod)

    await mod.load()

    m.loaded = true

    return mod
  }

  async syncCommands() {
    this.logger.debug(`Syncing commands...`)
    const commands = this.slashCommands.filter((x) => !x.guild)
    const guild = this.client.options.applicationCommands.guild
    if (guild) {
      const syncForGuild = async (g: Guild) => {
        this.logger.debug(`Syncing for guild ${g.name}(${g.id})`)
        const commandsToRegister = [
          ...commands.map((x) => x.command),
          ...this.slashCommands.filter((y) => y.guild === g.id || y.guild?.includes(g.id) || false).map((x) => x.command),
        ]
        this.logger.debug(`Command List: ${commandsToRegister.map((x) => x.name).join(', ')}`)
        await g.commands.set(commandsToRegister)
      }

      if (typeof guild === 'string') {
        await syncForGuild(await this.client.client.guilds.fetch(guild))
      } else {
        for (const g of guild) {
          await syncForGuild(await this.client.client.guilds.fetch(g))
        }
      }
    } else {
      this.logger.debug('Syncing global...')
      await this.client.client.application?.commands.set(commands.map((x) => x.command))
    }
    this.logger.debug('Syncing ended.')
  }

  async unregisterModule(module: Module) {
    if (Reflect.getMetadata(KBuiltInModule, module)) throw new Error('Built-in modules cannot be unloaded')
    const symbol = this.modules.findKey((x) => x === module)
    if (!symbol) return module
    await module.unload()
    const list: ListenerExecutor[] = Reflect.getMetadata(KListenerExecuteCache, module)
    for (const listener of list) {
      this.client.client.removeListener(listener.event, listener.execute)
    }
    this.modules.delete(symbol)
    return module
  }

  async unloadModule(module: Module) {
    const p = Reflect.getMetadata(KModulePath, module)

    if (!p) throw new InvalidModuleError('This module is not loaded by loadModule.')

    await this.unregisterModule(module)
    delete require.cache[p]
  }

  async reloadModule(module: Module) {
    await module.beforeReload()
    const p = Reflect.getMetadata(KModulePath, module)
    await this.unloadModule(module)
    const mod = await this.loadModule(p, true)
    await mod.afterReload()
    return true
  }

  async reloadAll() {
    const results: {
      path: string
      success: boolean
      error?: Error
    }[] = []

    for (const [, module] of this.modules.filter((x) => !!x.path && !Reflect.getMetadata(KBuiltInModule, x))) {
      try {
        await this.reloadModule(module)
        results.push({
          path: module.path!,
          success: true,
        })
      } catch (e: any) {
        results.push({
          error: e,
          path: module.path!,
          success: false,
        })
      }
    }
    return results
  }
}
