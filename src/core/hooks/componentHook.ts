import { Collection } from 'discord.js'
import { ComponentHookSymbol } from '../symbols'

export type ComponentHookFn<T extends unknown[]> = (...args: T) => void | Promise<void>

export type ComponentHookStore = Collection<string, ComponentHookFn<unknown[]>[]>

export const getComponentHookStore = (target: object, property: string | symbol): ComponentHookStore => {
  let data = Reflect.getMetadata(ComponentHookSymbol, target, property) as ComponentHookStore

  if (!data) {
    data = new Collection()
    Reflect.defineMetadata(ComponentHookSymbol, data, target, property)
  }

  return data
}

export const createComponentHook = <T extends unknown[]>(name: string, fn: ComponentHookFn<T>): MethodDecorator => {
  return (target, key) => {
    const store = getComponentHookStore(target, key)

    let hooks = store.get(name)

    if (!hooks) {
      hooks = []
      store.set(name, hooks)
    }

    // @ts-expect-error unknown type
    hooks.unshift(fn)
  }
}
