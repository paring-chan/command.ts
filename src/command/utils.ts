/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { CommandInteraction, ContextMenuInteraction, Message, MessageComponentInteraction } from 'discord.js'
import type { CheckFunction, ApplicationCommandCheckFunction } from './Command'
import { KCommandChecks, KApplicationCommandChecks } from '../constants'

export const createCheckDecorator = (
  execute: ((msg: Message) => boolean | Promise<boolean>) | null,
  executeApplicationCommand?: (i: CommandInteraction | MessageComponentInteraction | ContextMenuInteraction) => boolean | Promise<boolean>,
): MethodDecorator => {
  return (target, propertyKey) => {
    if (execute) {
      let properties: CheckFunction[] = Reflect.getMetadata(KCommandChecks, target, propertyKey)
      if (properties) {
        properties.push(execute)
      } else {
        properties = [execute]
        Reflect.defineMetadata(KCommandChecks, properties, target, propertyKey)
      }
    }
    if (executeApplicationCommand) {
      let properties: ApplicationCommandCheckFunction[] = Reflect.getMetadata(KApplicationCommandChecks, target, propertyKey)
      if (properties) {
        properties.push(executeApplicationCommand)
      } else {
        properties = [executeApplicationCommand]
        Reflect.defineMetadata(KApplicationCommandChecks, properties, target, propertyKey)
      }
    }
  }
}
