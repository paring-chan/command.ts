/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { MessageComponentInteraction, ComponentType } from 'discord.js'
import { Module } from '../structures'

export type MessageComponentExecutor = (i: MessageComponentInteraction) => void | Promise<void>

export class MessageComponentHandler {
  constructor(public componentId: string, public componentType: Omit<ComponentType, 'Button'>, public execute: MessageComponentExecutor) {}

  run(module: Module, i: MessageComponentInteraction) {
    return this.execute.apply(module, [i])
  }
}
