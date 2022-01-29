/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { ApplicationCommandDataResolvable, Collection, Snowflake } from 'discord.js'
import { checkTarget } from '../utils'
import { KSlashCommandOptions, KApplicationCommands } from '../constants'
import { Module } from '../structures'
import { AppCommand } from './AppCommand'

type ApplicationCommandOptions = {
  guild: Snowflake | Snowflake[]
  optionTypes?: any[]
}

export const applicationCommand = (opt: Partial<ApplicationCommandOptions> & { command: ApplicationCommandDataResolvable }) => {
  return (
    target: Object,
    propertyKey: string,
    // descriptor: TypedPropertyDescriptor<any>,
  ) => {
    checkTarget(target)

    let properties: AppCommand[] = Reflect.getMetadata(KApplicationCommands, target)

    const params: any[] = opt.optionTypes ?? Reflect.getMetadata('design:paramtypes', target, propertyKey)

    const options: Collection<number, string> = Reflect.getMetadata(KSlashCommandOptions, target, propertyKey) || new Collection<number, string>()

    const command = new AppCommand(
      opt.command,
      Reflect.get(target, propertyKey),
      target as Module,
      params.map((x, i) => ({
        type: x,
        name: options.get(i),
      })),
      opt.guild,
      propertyKey,
    )

    if (properties) {
      properties.push(command)
    } else {
      properties = [command]
      Reflect.defineMetadata(KApplicationCommands, properties, target)
    }
  }
}

export const option = (key: string): ParameterDecorator => (target, propertyKey, parameterIndex) => {
  checkTarget(target)

  let properties: Collection<number, string> = Reflect.getMetadata(KSlashCommandOptions, target, propertyKey)

  if (!properties) {
    properties = new Collection<number, string>()
    Reflect.defineMetadata(KSlashCommandOptions, properties, target, propertyKey)
  }

  properties.set(parameterIndex, key)
}
