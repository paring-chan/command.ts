import { CommandClient } from './CommandClient'
import { Module } from './Module'
import { Command } from '../command'
import { KCommands, KModulePath } from '../constants'
import path from 'path'
import {
  InvalidModuleError,
  InvalidTargetError,
  ModuleLoadError,
} from '../error'
import { Collection } from 'discord.js'
import walkSync from 'walk-sync'

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Collection<symbol, Module> = new Collection()

  get commands(): Command[] {
    const result: Command[] = []

    for (const [, module] of this.modules) {
      result.push(...module.commands)
    }

    return result
  }

  registerModule(module: Module) {
    this.modules.set(Symbol(module.constructor.name), module)
    return module
  }

  loadModulesIn(dir: string, absolute = false) {
    let p = absolute ? dir : path.join(require.main!.path, dir)

    for (const i of walkSync(p)) {
      this.loadModule(path.join(p, i), true)
    }
  }

  loadModule(file: string, absolute: boolean = false) {
    let p = absolute ? file : path.join(require.main!.path, file)

    let m

    try {
      m = require(p)
    } catch (e: any) {
      throw new ModuleLoadError(p)
    }

    if (m.loaded) throw new Error('MODULE_ALREADY_LOADED')

    if (!m.install) throw new InvalidModuleError('Install function not found.')

    const mod = m.install(this.client)

    if (!(mod instanceof Module)) throw new InvalidTargetError()

    Reflect.defineMetadata(KModulePath, require.resolve(p), mod)

    this.registerModule(mod)

    mod.load()

    m.loaded = true

    return mod
  }

  unregisterModule(module: Module) {
    const symbol = this.modules.findKey((x) => x === module)
    if (!symbol) return module
    module.unload()
    this.modules.delete(symbol)
    return module
  }

  unloadModule(module: Module) {
    const p = Reflect.getMetadata(KModulePath, module)

    if (!p)
      throw new InvalidModuleError('This module is not loaded by loadModule.')

    this.unregisterModule(module)
    delete require.cache[p]
  }
}
