/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Client, IntentsBitField } from 'discord.js'
import { CommandClient } from '../src'

const config = require('./config.json')

const client = new Client({
  intents: IntentsBitField.resolve([]),
})

const cts = new CommandClient({
  owners: 'auto',
  client,
  command: {
    prefix: '!',
  },
  applicationCommands: {
    autoSync: true,
    guild: '852227147196137552',
  },
})

require('./modules/test')

cts.registry.loadModulesIn('modules')

client.login(config.token)
