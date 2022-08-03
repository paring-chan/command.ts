/*
 * File: decoratorCreator.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { Collection } from 'discord.js'
import { ComponentHookStore } from '../hooks'
import { getComponentHookStore } from '../hooks/componentHook'
import { ComponentStoreSymbol } from '../symbols'
import { BaseComponent } from './BaseComponent'
import { ComponentArgumentDecorator } from './ComponentArgumentDecorator'

type ComponentStore = Collection<string | symbol, BaseComponent>
type ComponentArgumentStore = Collection<number, ComponentArgumentDecorator>

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
      var arg: ComponentArgumentDecorator<Options> = new type(options)

      const store = getComponentArgumentStore(target, key)

      store.set(idx, arg)
    }
  }
}
