import { Collection } from 'discord.js'
import type { AnyFunction } from '../../utils/types'
import type { ComponentHookStore } from '../hooks'
import { ComponentArgument } from './ComponentArgument'

export class BaseComponent {
  method!: AnyFunction

  hooks: ComponentHookStore = new Collection()

  argTypes: Collection<number, ComponentArgument> = new Collection()

  _init(method: AnyFunction, argTypes: unknown[]) {
    this.method = method
    for (let i = 0; i < argTypes.length; i++) {
      const element = argTypes[i]
      this.argTypes.set(i, new ComponentArgument(element))
    }
  }

  async executeGlobalHook(target: object, name: string, args: unknown[]) {
    const { CommandClient } = await import('../structures/CommandClient')

    const client = CommandClient.getFromModule(target)

    const globalHooks = client.registry.globalHooks[name]

    if (globalHooks) {
      for (const fn of globalHooks) {
        await fn.call(null, client, ...args)
      }
    }
  }

  async executeHook(target: object, name: string, args: unknown[]) {
    const hook = this.hooks.get(name)

    if (!hook) return

    const { CommandClient } = await import('../structures/CommandClient')

    const client = CommandClient.getFromModule(target)

    const globalHooks = client.registry.globalHooks[name]

    if (globalHooks) {
      hook.unshift(...globalHooks)
    }

    for (const fn of hook) {
      await fn.call(null, client, ...args)
    }
  }

  async execute(target: object, args: unknown[], beforeCallArgs: unknown[] = args) {
    await this.executeHook(target, 'beforeCall', beforeCallArgs)
    let result
    try {
      result = await this.method.call(target, ...args)
      await this.executeHook(target, 'afterCall', [...beforeCallArgs, result])
    } catch (e) {
      await this.executeHook(target, 'invokeError', [e, ...beforeCallArgs])
      throw e
    }

    return result
  }
}
