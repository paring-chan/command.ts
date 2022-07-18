import _ from 'lodash'
import { getModuleHookStore } from '../hooks'

export class Registry {
  extensions: object[] = []

  async withGroup(name: string, code: () => void | Promise<void>) {}

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
