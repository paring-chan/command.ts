/*
 * File: BaseComponent.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { Collection } from 'discord.js'
import _ from 'lodash'
import type { ComponentHookStore } from '../hooks'
import { ComponentArgument } from './ComponentArgument'

export class BaseComponent {
  method!: Function

  hooks: ComponentHookStore = new Collection()

  argTypes: Collection<number, ComponentArgument> = new Collection()

  _init(method: Function, argTypes: unknown[]) {
    this.method = method
    for (let i = 0; i < argTypes.length; i++) {
      const element = argTypes[i]
      this.argTypes.set(i, new ComponentArgument(element))
    }
  }

  async executeHook(target: object, name: string, args: unknown[]) {
    const hook = this.hooks.get(name)

    if (!hook) return

    const { CommandClient } = await import('../structures/CommandClient')

    for (const fn of hook) {
      await fn.call(null, CommandClient.getFromModule(target), ...args)
    }
  }

  async execute(target: object, args: unknown[], beforeCallArgs: unknown[] = args) {
    await this.executeHook(target, 'beforeCall', beforeCallArgs)
    let result
    try {
      result = await this.method.call(target, ...args)
    } catch (e) {
      await this.executeHook(target, 'invokeError', [e])
      throw e
    }
    await this.executeHook(target, 'afterCall', [result])

    return result
  }
}
