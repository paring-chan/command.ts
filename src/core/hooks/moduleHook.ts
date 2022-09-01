/*
 * File: moduleHook.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { Collection } from 'discord.js'
import { ModuleHookStoreSymbol } from '../symbols'

export type ModuleHookStore = Collection<string, Function[]>

export const getModuleHookStore = (target: object) => {
  let result: ModuleHookStore | null = Reflect.getMetadata(ModuleHookStoreSymbol, target)

  if (!result) {
    result = new Collection()

    Reflect.defineMetadata(ModuleHookStoreSymbol, result, target)
  }

  return result
}

export const moduleHook = (name: string): MethodDecorator => {
  return (target, key) => {
    const store = getModuleHookStore(target)

    let v = store.get(name)

    if (!v) {
      v = []
      store.set(name, v)
    }

    v.push(Reflect.get(target, key))
  }
}
