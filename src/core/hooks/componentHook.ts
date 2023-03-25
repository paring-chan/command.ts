import { Collection } from 'discord.js'
import { ComponentHookSymbol } from '../symbols'

export type ComponentHookFn = (...args: any[]) => void | Promise<void>

export type ComponentHookStore = Collection<string, ComponentHookFn[]>

export const getComponentHookStore = (target: object, property: string | symbol): ComponentHookStore => {
  let data = Reflect.getMetadata(ComponentHookSymbol, target, property) as ComponentHookStore

  if (!data) {
    data = new Collection()
    Reflect.defineMetadata(ComponentHookSymbol, data, target, property)
  }

  return data
}

export const createComponentHook = (name: string, fn: ComponentHookFn): MethodDecorator => {
  return (target, key) => {
    const store = getComponentHookStore(target, key)

    let hooks = store.get(name)

    if (!hooks) {
      hooks = []
      store.set(name, hooks)
    }

    hooks.unshift(fn)
  }
}
