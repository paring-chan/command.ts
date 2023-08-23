import { Collection } from 'discord.js'
import type { ComponentHookStore } from '../hooks'
import { getComponentHookStore } from '../hooks/componentHook'
import { ComponentStoreSymbol } from '../symbols'
import type { BaseComponent } from './BaseComponent'
import type { ComponentArgumentDecorator } from './ComponentArgumentDecorator'

export type ComponentStore = Collection<string | symbol, BaseComponent>
export type ComponentArgumentStore = Collection<number, ComponentArgumentDecorator>

export const getComponentStore = (target: object): ComponentStore => {
  let result: ComponentStore | null = Reflect.getMetadata(ComponentStoreSymbol, target)

  if (!result) {
    result = new Collection()

    Reflect.defineMetadata(ComponentStoreSymbol, result, target)
  }

  return result
}

export const getComponent = (target: object, key: string | symbol) => {
  const store = getComponentStore(target)

  return store.get(key)
}

export const createComponentDecorator = (component: BaseComponent): MethodDecorator => {
  return (target, key) => {
    component._init(Reflect.get(target, key), Reflect.getMetadata('design:paramtypes', target, key))

    const componentHookStore: ComponentHookStore = getComponentHookStore(target, key)

    component.hooks = componentHookStore

    const store = getComponentStore(target)

    const decorators = getComponentArgumentStore(target, key)

    decorators.forEach((x, i) => {
      component.argTypes.get(i)?.decorators.push(x)
    })

    store.set(key, component)
  }
}

export const getComponentArgumentStore = (target: object, key: string | symbol): ComponentArgumentStore => {
  let result: ComponentArgumentStore | null = Reflect.getMetadata(ComponentStoreSymbol, target, key)

  if (!result) {
    result = new Collection()

    Reflect.defineMetadata(ComponentStoreSymbol, result, target, key)
  }

  return result
}

export const createArgumentDecorator = <Options>(type: typeof ComponentArgumentDecorator<Options>) => {
  return (options: Options): ParameterDecorator => {
    return (target, key, idx) => {
      if (!key) return

      const arg: ComponentArgumentDecorator<Options> = new type(options)

      const store = getComponentArgumentStore(target, key)

      store.set(idx, arg)
    }
  }
}
