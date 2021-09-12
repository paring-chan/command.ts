import { KCommands, KListeners } from '../constants'
import type { Command } from '../command'
import { Listener } from '../listener'

export abstract class Module {
  get commands(): Command[] {
    return Reflect.getMetadata(KCommands, this) || []
  }

  get listeners(): Listener[] {
    return Reflect.getMetadata(KListeners, this) || []
  }

  load() {}
  unload() {}
  beforeReload() {}
  afterReload() {}
}
