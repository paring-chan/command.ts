/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Message } from 'discord.js'
import { Command } from '../command'

export class ArgumentNotProvided extends Error {
  constructor(public index: number, public command: Command, public msg: Message) {
    super(`Required argument #${index} not provided.`)
  }
}
