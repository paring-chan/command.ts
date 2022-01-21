import { Module } from '../structures'
import { ApplicationCommandDataResolvable, Snowflake } from 'discord.js'
import { KSlashCommandChecks } from '../constants'
import { SlashCheckFunction } from '../command'

export type SlashArgument = {
  type: any
  name?: string
}

export class AppCommand {
  get checks(): SlashCheckFunction[] {
    return Reflect.getMetadata(KSlashCommandChecks, this.module, this.key) || []
  }

  execute(module: Module, args: any[]) {
    return this.run.apply(module, args)
  }

  constructor(
    public command: ApplicationCommandDataResolvable,
    private run: Function,
    public module: Module,
    public params: SlashArgument[],
    public guild: Snowflake | Snowflake[] | undefined,
    private key: string | symbol,
  ) {}
}
