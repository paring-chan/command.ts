import chalk from 'chalk'
import { Collection } from 'discord.js'
import EventEmitter from 'events'
import _ from 'lodash'
import { Logger } from 'tslog'
import { BaseComponent, getComponentStore } from '../components'
import { getModuleHookStore } from '../hooks'
import { ListenerComponent } from '../listener'
import { CommandClientSymbol } from '../symbols'
import { CommandClient } from './CommandClient'

export class Registry {
  extensions: object[] = []

  emitters: Collection<string, EventEmitter> = new Collection()

  logger: Logger

  constructor(logger: Logger, public client: CommandClient) {
    this.logger = logger.getChildLogger({
      prefix: [chalk.green('[Registry]')],
    })
  }

  getComponentsWithTypeGlobal<T extends typeof BaseComponent<Config>, Config>(type: T): InstanceType<T>[] {
    const result: InstanceType<T>[] = []

    for (const ext of this.extensions) {
      result.push(...this.getComponentsWithType(ext, type))
    }

    return result
  }

  getComponentsWithType<T extends typeof BaseComponent<Config>, Config>(ext: object, type: T): InstanceType<T>[] {
    const componentStore = getComponentStore(ext)

    return Array.from(componentStore.filter((x) => (x.constructor as unknown) === type).values() as Iterable<InstanceType<T>>)
  }

  registerEventListeners(ext: object) {
    const listeners = this.getComponentsWithType(ext, ListenerComponent)

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
    const listeners = this.getComponentsWithType(ext, ListenerComponent)

    for (const listener of listeners) {
      const emitter = this.emitters.get(listener.options.emitter)
      const bound = Reflect.getMetadata('bound', listener)

      if (emitter && bound) {
        emitter.removeListener(listener.options.event, bound)
      }
    }
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
