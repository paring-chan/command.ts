import { Collection } from 'discord.js'
import EventEmitter from 'events'
import _ from 'lodash'
import { BaseComponent, getComponentStore } from '../components'
import { getModuleHookStore } from '../hooks'
import { ListenerComponent } from '../listener'
import { ListenersSymbol } from '../symbols'

export class Registry {
  extensions: object[] = []

  emitters: Collection<string, EventEmitter> = new Collection()

  getComponentsWithTypeGlobal<T extends typeof BaseComponent<Config, RequiredConfig>, Config, RequiredConfig>(type: T): InstanceType<T>[] {
    const result: InstanceType<T>[] = []

    for (const ext of this.extensions) {
      result.push(...this.getComponentsWithType(ext, type))
    }

    return result
  }

  getComponentsWithType<T extends typeof BaseComponent<Config, RequiredConfig>, Config, RequiredConfig>(ext: object, type: T): InstanceType<T>[] {
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
    this.registerEventListeners(ext)
    await this.runModuleHook(ext, 'load')
    this.extensions.push(ext)
  }

  async unregisterModule(ext: object) {
    this.unregisterEventListeners(ext)
    await this.runModuleHook(ext, 'unload')
    _.remove(this.extensions, (x) => x === ext)
  }

  runModuleHook(ext: object, hookName: string, ...args: unknown[]) {
    const hooks = getModuleHookStore(ext)

    const functions = hooks.get(hookName)

    if (functions) {
      for (const fn of functions) {
        fn.apply(ext, args)
      }
    }
  }

  registerEventEmitter(name: string, emitter: EventEmitter) {
    this.emitters.set(name, emitter)
  }
}
