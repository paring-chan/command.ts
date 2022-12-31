/*
 * File: Registry.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import chalk from 'chalk'
import { Collection } from 'discord.js'
import EventEmitter from 'events'
import _, { result } from 'lodash'
import { Logger } from 'tslog'
import { getComponentStore } from '../components'
import { getModuleHookStore } from '../hooks'
import { ListenerComponent } from '../listener'
import { CommandClientSymbol, FilePathSymbol } from '../symbols'
import { CommandClient } from './CommandClient'
import walkSync from 'walk-sync'
import path from 'path'
import { ComponentHookFn } from '../hooks/componentHook'

export class Registry {
  extensions: object[] = []

  emitters: Collection<string, EventEmitter> = new Collection()

  logger: Logger<unknown>

  globalHooks: Record<string, ComponentHookFn[]> = {}

  constructor(logger: Logger<unknown>, public client: CommandClient) {
    this.logger = logger.getSubLogger({
      prefix: [chalk.green('[Registry]')],
    })
  }

  addGlobalHook(name: string, fn: ComponentHookFn) {
    let hooks = this.globalHooks[name]

    if (!hooks) {
      hooks = []
      this.globalHooks[name] = hooks
    }

    hooks.push(fn)
  }

  getComponentsWithTypeGlobal<T>(type: unknown): T[] {
    const result: T[] = []

    for (const ext of this.extensions) {
      result.push(...this.getComponentsWithType<T>(ext, type))
    }

    return result
  }

  getComponentsWithType<T>(ext: object, type: unknown): T[] {
    const componentStore = getComponentStore(ext)

    return Array.from(componentStore.filter((x) => (x.constructor as unknown) === type).values() as Iterable<T>)
  }

  registerEventListeners(ext: object) {
    const listeners = this.getComponentsWithType<ListenerComponent>(ext, ListenerComponent)

    for (const listener of listeners) {
      const emitter = this.emitters.get(listener.options.emitter)

      if (emitter) {
        const bound = listener.method.bind(ext)

        Reflect.defineMetadata('bound', bound, listener)

        emitter.addListener(listener.options.event, bound)
      }
    }
  }

  unregisterEventListeners(ext: object) {
    const listeners = this.getComponentsWithType<ListenerComponent>(ext, ListenerComponent)

    for (const listener of listeners) {
      const emitter = this.emitters.get(listener.options.emitter)
      const bound = Reflect.getMetadata('bound', listener)

      if (emitter && bound) {
        emitter.removeListener(listener.options.event, bound)
      }
    }
  }

  async loadAllModulesInDirectory(dir: string): Promise<object[]> {
    const results: object[] = []

    const files = walkSync(dir).filter((x) => x.endsWith('.ts') || x.endsWith('.js'))

    for (const file of files) {
      if (file.endsWith('.d.ts')) continue
      const p = path.join(dir, file)
      results.push(...(await this.loadModulesAtPath(p)))
    }

    return results
  }

  async loadModulesAtPath(file: string) {
    this.logger.info(`Loading module at path ${chalk.green(file)}`)

    const p = require.resolve(file)

    const mod = require(p)

    if (typeof mod.setup !== 'function') throw new Error('Extension must have a setup function')

    const modules = await mod.setup(this.client)

    return this.registerModules(modules, p)
  }

  private async registerModules(modules: object | object[], p: string) {
    const results: object[] = []
    if (modules instanceof Array) {
      for (const module of modules) {
        await this.registerModule(module)
        Reflect.defineMetadata(FilePathSymbol, p, module)
        results.push(module)
      }
    } else {
      await this.registerModule(modules)
      Reflect.defineMetadata(FilePathSymbol, p, modules)
      results.push(modules)
    }

    return results
  }

  async reloadModules() {
    const result: { file: string; result: boolean; error?: Error; extensions?: object[] }[] = []
    const paths = new Set<string>()
    const extensions = [...this.extensions]
    for (const module of extensions) {
      const file = Reflect.getMetadata(FilePathSymbol, module)
      if (!file) continue

      this.logger.info(`Unloading module: ${chalk.green(module.constructor.name)}`)

      paths.add(file)

      await this.unregisterModule(module)

      delete require.cache[require.resolve(file)]
    }

    for (const path of paths) {
      try {
        const extensions = await this.loadModulesAtPath(path)

        result.push({
          file: path,
          result: true,
          extensions,
        })
      } catch (e) {
        result.push({
          file: path,
          result: false,
          error: e as Error,
        })
      }
    }

    return result
  }

  async registerModule(ext: object) {
    Reflect.defineMetadata(CommandClientSymbol, this.client, ext)

    this.registerEventListeners(ext)
    await this.runModuleHook(ext, 'load')
    this.extensions.push(ext)
    this.logger.info(`Module registered: ${chalk.green(ext.constructor.name)}`)
  }

  async unregisterModule(ext: object) {
    this.unregisterEventListeners(ext)
    await this.runModuleHook(ext, 'unload')
    _.remove(this.extensions, (x) => x === ext)
    this.logger.info(`Module unregistered: ${chalk.green(ext.constructor.name)}`)
  }

  runModuleHook(ext: object, hookName: string, ...args: unknown[]) {
    const hooks = getModuleHookStore(ext)

    const functions = hooks.get(hookName)

    if (functions) {
      for (const fn of functions) {
        fn.call(ext, ...args)
      }
    }
  }

  registerEventEmitter(name: string, emitter: EventEmitter) {
    this.emitters.set(name, emitter)
  }
}
