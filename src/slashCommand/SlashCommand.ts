import { SlashCommandBuilder } from '@discordjs/builders'
import { Module } from '../structures'

export class SlashCommand {
  constructor(
    public commandBuilder: SlashCommandBuilder,
    public execute: Function,
    public module: Module,
    params: {
      type: any
      name?: string
    }[],
  ) {}
}
