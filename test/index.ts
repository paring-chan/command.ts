import { Client, Intents, IntentsString } from 'discord.js'
import { CommandClient } from '../src'
import { DJSAdapter } from '../src/adapters/DJSAdapter'

const config = require('./config.json')

const client = new Client({
  intents: Object.keys(Intents.FLAGS) as IntentsString[],
})

const cts = new CommandClient({
  owners: 'auto',
  adapter: new DJSAdapter(client),
  command: {
    prefix: '!',
  },
})

client.login(config.token)
