import chalk from 'chalk'
import { Collection } from 'discord.js'
import type { Logger } from 'tslog'
import type { ComponentArgument } from '../components/ComponentArgument'
import { ConverterComponent } from '../converter'
import { CommandClient } from '../structures'

export class Extension<Client extends CommandClient = CommandClient> {
  protected get commandClient() {
    return CommandClient.getFromModule(this) as Client
  }

  protected get client() {
    return this.commandClient.discord
  }

  protected _logger?: Logger<unknown>

  protected get logger() {
    if (!this._logger) this._logger = this.commandClient.logger.getSubLogger({ name: chalk.green(`${this.constructor.name}`) })
    return this._logger
  }

  protected async convertArguments(
    component: unknown,
    argList: unknown[],
    args: Collection<number, ComponentArgument>,
    getConverterArgs: (arg: ComponentArgument, index: number, converter: ConverterComponent<unknown>) => unknown[] | Promise<unknown[]>,
  ) {
    const items = new Collection<unknown, { ext: object; component: ConverterComponent<unknown> }>()

    for (const extension of this.commandClient.registry.extensions) {
      for (const converter of this.commandClient.registry.getComponentsWithType<ConverterComponent<unknown>>(extension, ConverterComponent)) {
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
