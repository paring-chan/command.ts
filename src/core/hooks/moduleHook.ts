import { Collection } from 'discord.js'
import { ModuleHookStoreSymbol } from '../symbols'

type ModuleHookStore = Collection<string | symbol, Function[]>

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

    let v = store.get(key)

    if (!v) {
      v = []
      store.set(key, v)
    }

    v.push(Reflect.get(target, key))
  }
}
