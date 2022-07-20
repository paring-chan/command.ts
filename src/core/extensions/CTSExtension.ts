import chalk from 'chalk'
import { Extension } from './Extension'

export class CTSExtension extends Extension {
  protected get logger() {
    if (!this._logger) this._logger = this.commandClient.ctsLogger.getChildLogger({ prefix: [chalk.green(`[${this.constructor.name}]`)], displayFunctionName: false })
    return this._logger
  }
}
