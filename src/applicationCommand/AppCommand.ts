import { Module } from '../structures'
import { ApplicationCommandDataResolvable, Snowflake } from 'discord.js'
import { KApplicationCommandChecks } from '../constants'
import { ApplicationCommandCheckFunction } from '../command'

export type AppCommandArgument = {
  type: any
  name?: string
}

export class AppCommand {
  get checks(): ApplicationCommandCheckFunction[] {
    return Reflect.getMetadata(KApplicationCommandChecks, this.module, this.key) || []
  }

  execute(module: Module, args: any[]) {
    return this.run.apply(module, args)
  }

  constructor(
    public command: ApplicationCommandDataResolvable,
    private run: Function,
    public module: Module,
    public params: AppCommandArgument[],
    public guild: Snowflake | Snowflake[] | undefined,
    private key: string | symbol,
  ) {}
}
