/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { KArgumentConverters, KCommands, KListeners, KMessageComponentHandlers, KModulePath, KSlashArgumentConverters, KApplicationCommands } from '../constants'
import type { Command } from '../command'
import { Listener } from '../listener'
import { ArgumentConverter, ApplicationCommandArgumentConverter } from '../command'
import { AppCommand } from '../applicationCommand'
import { CommandClient } from './CommandClient'
import { MessageComponentHandler } from '../messageComponents/base'

export abstract class Module {
  commandClient!: CommandClient

  get logger() {
    return this.commandClient.logger.getChildLogger({
      name: this.constructor.name,
    })
  }

  get commands(): Command[] {
    return Reflect.getMetadata(KCommands, this) || []
  }

  get listeners(): Listener[] {
    return Reflect.getMetadata(KListeners, this) || []
  }

  get argumentConverters(): ArgumentConverter[] {
    return Reflect.getMetadata(KArgumentConverters, this) || []
  }

  get applicationCommandArgumentConverters(): ApplicationCommandArgumentConverter[] {
    return Reflect.getMetadata(KSlashArgumentConverters, this) || []
  }

  get applicationCommands(): AppCommand[] {
    return Reflect.getMetadata(KApplicationCommands, this) || []
  }

  get messageComponentHandlers(): MessageComponentHandler[] {
    return Reflect.getMetadata(KMessageComponentHandlers, this) || []
  }

  get path(): string | undefined {
    return Reflect.getMetadata(KModulePath, this)
  }

  load() {}
  unload() {}
  beforeReload() {}
  afterReload() {}
}
