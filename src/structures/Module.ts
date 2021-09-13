import { KArgumentConverters, KCommands, KListeners } from '../constants'
import type { Command } from '../command'
import { Listener } from '../listener'
import { ArgumentConverter } from '../command/ArgumentConverter'

export abstract class Module {
  get commands(): Command[] {
    return Reflect.getMetadata(KCommands, this) || []
  }

  get listeners(): Listener[] {
    return Reflect.getMetadata(KListeners, this) || []
  }

  get argumentConverters(): ArgumentConverter[] {
    return Reflect.getMetadata(KArgumentConverters, this) || []
  }

  load() {}
  unload() {}
  beforeReload() {}
  afterReload() {}
}
