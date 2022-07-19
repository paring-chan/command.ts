import chalk from 'chalk'
import { Logger } from 'tslog'
import { CommandClient } from '../structures'

export class Extension {
  protected get commandClient() {
    return CommandClient.getFromModule(this)
  }

  protected get client() {
    return this.commandClient.discord
  }

  private _logger?: Logger

  protected get logger() {
    if (!this._logger) this._logger = this.commandClient.logger.getChildLogger({ prefix: [chalk.green(`[${this.constructor.name}]`)], displayFunctionName: false })
    return this._logger
  }
}
