import { Client, Intents, IntentsString } from 'discord.js'
import { CommandClient } from '../src'

const config = require('./config.json')

const client = new Client({
  intents: Object.keys(Intents.FLAGS) as IntentsString[],
})

const cts = new CommandClient({
  owners: 'auto',
  client,
  command: {
    prefix: '!',
  },
})

cts.registry.loadModulesIn('modules')

client.login(config.token)
