import { SlashCommandBuilder } from '@discordjs/builders'
import { Module } from '../structures'
import { Snowflake } from 'discord.js'

export class SlashCommand {
  constructor(
    public commandBuilder: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    public execute: Function,
    public module: Module,
    public params: {
      type: any
      name?: string
    }[],
    public guild: Snowflake | Snowflake[] | undefined,
  ) {}
}
