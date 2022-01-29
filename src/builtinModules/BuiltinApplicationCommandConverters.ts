/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { BuiltInModule } from './BuiltInModule'
import { Client } from 'discord.js'
import { CommandClient } from '../structures'

export class BuiltinApplicationCommandConverters extends BuiltInModule {
  client: Client

  constructor(private cts: CommandClient) {
    super()
    this.client = cts.client
  }
}
