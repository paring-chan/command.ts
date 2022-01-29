/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { MessageComponentInteraction, MessageComponentType } from 'discord.js'
import { Module } from '../structures'

export type MessageComponentExecutor = (i: MessageComponentInteraction) => void | Promise<void>

export class MessageComponentHandler {
  constructor(public componentId: string, public componentType: Exclude<MessageComponentType, 'ACTION_ROW'>, public execute: MessageComponentExecutor) {}

  run(module: Module, i: MessageComponentInteraction) {
    return this.execute.apply(module, [i])
  }
}
