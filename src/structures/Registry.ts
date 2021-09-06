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

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Module[] = []

  get commands(): Command[] {
    const result: Command[] = []

    for (const module of this.modules) {
      const commands = Reflect.getMetadata(KCommands, module)
      result.push(...commands)
    }

    return result
  }

  registerModule(module: Module) {
    // TODO
  }

  loadModule(file: string, absolute: boolean = false) {
    let p = absolute ? file : path.join(require.main!.path, file)

    let m

    try {
      m = require(p)
    } catch (e: any) {
      throw new ModuleLoadError(p)
    }

    if (!m.install) throw new InvalidModuleError('Install function not found.')

    const mod = m.install()

    if (!(mod instanceof Module)) throw new InvalidTargetError()

    Reflect.defineMetadata(KModulePath, require.resolve(p), mod)

    this.registerModule(m)
  }

  unregisterModule(module: Module) {
    // TODO
  }

  unloadModule(module: Module) {
    // TODO
  }
}
