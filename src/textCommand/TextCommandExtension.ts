/*
 * File: TextCommandExtension.ts
 *
 * Copyright (c) 2022-2022 pikokr
 *
 * Licensed under MIT License. Please see more defails in LICENSE file.
 */

import { listener } from '../core/listener'
import { Message } from 'discord.js'
import { CTSExtension } from '../core/extensions/CTSExtension'
import { TextCommandComponent } from './TextCommand'
import { TextCommandRestOption } from './parameters'
import { argConverter } from '../core'

export type TextCommandConfig = {
  prefix: string | string[] | ((msg: Message) => Promise<string | string[]> | string | string[])
}

declare module 'discord.js' {
  interface Message {
    command: TextCommandComponent
  }
}

export class TextCommandExtension extends CTSExtension {
  constructor(private config: TextCommandConfig) {
    super()
  }

  private async processPrefix(msg: Message): Promise<number | null> {
    const content = msg.content
    let prefix = this.config.prefix

    if (typeof prefix === 'function') {
      prefix = await prefix(msg)
    }

    if (typeof prefix === 'string') {
      if (content.startsWith(prefix)) return prefix.length
      return null
    }

    if (prefix instanceof Array) {
      const p = prefix.find((x) => content.startsWith(x))

      if (p) return p.length
      return null
    }

    return null
  }

  @listener({ event: 'messageCreate', emitter: 'discord' })
  private async messageCreate(msg: Message) {
    try {
      const startIndex = await this.processPrefix(msg)

      if (!startIndex) return

      const content = msg.content.slice(startIndex)

      const commands: TextCommandComponent[] = []

      const extensions = new Map<TextCommandComponent, object>()

      for (const ext of this.commandClient.registry.extensions) {
        for (const cmd of this.commandClient.registry.getComponentsWithType<TextCommandComponent>(ext, TextCommandComponent)) {
          commands.push(cmd)
          extensions.set(cmd, ext)
        }
      }

      let commandNameLength = 0

      const command = commands.find((x) => {
        const names = [x.options.name]

        if (x.options.aliases) {
          names.push(...x.options.aliases)
        }

        for (const name of names) {
          if (content.startsWith(name)) {
            if (content.length === name.length) {
              commandNameLength = name.length
              return true
            }
            commandNameLength = name.length
            return content.startsWith(name + ' ')
          }
        }

        return false
      })

      if (!command) return

      const ext = extensions.get(command)

      if (!ext) return

      msg.command = command

      const args: unknown[] = []

      let argStrings = content.slice(commandNameLength + 1).split(/ /g)

      await this.convertArguments(TextCommandComponent, args, command.argTypes, async (arg, i, converter) => {
        if (converter.options.parameterless) return [msg]

        if (arg.decorators.find((x) => x.constructor === TextCommandRestOption)) {
          const text = argStrings.join(' ')
          argStrings = []
          return [text, msg]
        }
        return [argStrings.shift(), msg]
      })

      await command.execute(ext, args, [msg])
    } catch (e) {
      this.commandClient.emit('textCommandInvokeError', e, msg)
    }
  }

  @argConverter({ component: TextCommandComponent, type: Message, parameterless: true })
  async mesage(msg: Message) {
    return msg
  }

  @argConverter({ component: TextCommandComponent, type: String })
  async str(value: string) {
    return value
  }

  @argConverter({ component: TextCommandComponent, type: Number })
  async num(value: string) {
    return Number(value)
  }
}
