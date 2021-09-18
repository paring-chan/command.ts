import { Collection, Snowflake } from 'discord.js'
import { checkTarget } from '../utils'
import { KOptionals, KSlashCommandOptions, KSlashCommands } from '../constants'
import { Module } from '../structures'
import { SlashCommand } from './SlashCommand'
import { SlashCommandBuilder } from '@discordjs/builders'

type SlashOptions = {
  guild: Snowflake | Snowflake[]
}

export const slashCommand = (opt: Partial<SlashOptions> & { command: SlashCommandBuilder }) => {
  return (
    target: Object,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: SlashCommand[] = Reflect.getMetadata(KSlashCommands, target)

    const params: any[] = Reflect.getMetadata('design:paramtypes', target, propertyKey)

    const options: Collection<number, string> = Reflect.getMetadata(KSlashCommandOptions, target, propertyKey) || new Collection<number, string>()

    const command = new SlashCommand(
      opt.command,
      Reflect.get(target, propertyKey),
      target as Module,
      params.map((x, i) => ({
        type: x,
        name: options.get(i),
      })),
      opt.guild,
    )

    if (properties) {
      properties.push(command)
    } else {
      properties = [command]
      Reflect.defineMetadata(KSlashCommands, properties, target)
    }
  }
}

export const option = (key: string): ParameterDecorator => (target, propertyKey, parameterIndex) => {
  checkTarget(target)

  let properties: Collection<number, string> = Reflect.getMetadata(KSlashCommandOptions, target, propertyKey)

  if (!properties) {
    properties = new Collection<number, string>()
    Reflect.defineMetadata(KOptionals, properties, target, propertyKey)
  }

  properties.set(parameterIndex, key)
}
