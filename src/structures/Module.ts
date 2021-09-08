import { KCommands } from '../constants'
import type { Command } from '../command'

export abstract class Module {
  get commands(): Command[] {
    return Reflect.getMetadata(KCommands, this) || []
  }

  load() {}
  unload() {}
  beforeReload() {}
  afterReload() {}
}
