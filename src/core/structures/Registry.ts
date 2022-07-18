import _ from 'lodash'
import { getComponentStore } from '../components'
import { getModuleHookStore } from '../hooks'

export class Registry {
  extensions: object[] = []

  getComponentsWithType<T>(type: T): T[] {
    const result: T[] = []

    for (const ext of this.extensions) {
      const componentStore = getComponentStore(ext)

      result.push(...Array.from(componentStore.filter((x) => (x.constructor as unknown) === type).values() as Iterable<T>))
    }

    return result
  }

  async registerModule(ext: object) {
    await this.runModuleHook(ext, 'load')
    this.extensions.push(ext)
  }

  async unregisterModule(ext: object) {
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
}
