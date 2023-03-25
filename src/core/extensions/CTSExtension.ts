import chalk from 'chalk'
import { Extension } from './Extension'

export class CTSExtension extends Extension {
  protected get logger() {
    if (!this._logger) this._logger = this.commandClient.ctsLogger.getSubLogger({ name: chalk.green(`${this.constructor.name}`) })
    return this._logger
  }
}
