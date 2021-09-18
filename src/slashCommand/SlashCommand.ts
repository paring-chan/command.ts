import { SlashCommandBuilder } from '@discordjs/builders'
import { Module } from '../structures'
import { Snowflake } from 'discord.js'
import { KSlashCommandChecks } from '../constants'
import { SlashCheckFunction } from '../command'

export type SlashArgument = {
  type: any
  name?: string
}

export class SlashCommand {
  get checks(): SlashCheckFunction[] {
    return Reflect.getMetadata(KSlashCommandChecks, this.module, this.key) || []
  }

  execute(module: Module, args: any[]) {
    return this.run.apply(module, args)
  }

  constructor(
    public commandBuilder: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    private run: Function,
    public module: Module,
    public params: SlashArgument[],
    public guild: Snowflake | Snowflake[] | undefined,
    private key: string | symbol,
  ) {}
}
