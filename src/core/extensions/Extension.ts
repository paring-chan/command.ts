/*
* File: Extension.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import chalk from 'chalk'
import { Collection } from 'discord.js'
import { Logger } from 'tslog'
import { BaseComponent } from '../components'
import { ComponentArgument } from '../components/ComponentArgument'
import { ConverterComponent } from '../converter'
import { CommandClient } from '../structures'

export class Extension {
  protected get commandClient() {
    return CommandClient.getFromModule(this)
  }

  protected get client() {
    return this.commandClient.discord
  }

  protected _logger?: Logger

  protected get logger() {
    if (!this._logger) this._logger = this.commandClient.logger.getChildLogger({ prefix: [chalk.green(`[${this.constructor.name}]`)], displayFunctionName: false })
    return this._logger
  }

  protected async convertArguments(
    component: typeof BaseComponent<unknown>,
    argList: unknown[],
    args: Collection<number, ComponentArgument>,
    getConverterArgs: (arg: ComponentArgument, index: number, converter: ConverterComponent) => unknown[] | Promise<unknown[]>,
  ) {
    const items = new Collection<unknown, { ext: object; component: ConverterComponent }>()

    for (const extension of this.commandClient.registry.extensions) {
      for (const converter of this.commandClient.registry.getComponentsWithType(extension, ConverterComponent)) {
        if (converter.options.component != component) continue

        items.set(converter.options.type, { component: converter, ext: extension })
      }
    }

    for (const [index, arg] of args) {
      const converter = items.get(arg.type)

      if (!converter) {
        argList[index] = undefined
        continue
      }

      const converterArgs = await getConverterArgs(arg, index, converter.component)

      argList[index] = await converter.component.execute(converter.ext, converterArgs)
    }
  }
}
