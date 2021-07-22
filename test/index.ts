import path from 'path'

const config = require('./config.json')
import { CommandClient } from '../src'

const client = new CommandClient(
  {
    intents: [
      'GUILDS',
      'GUILD_MEMBERS',
      'GUILD_BANS',
      'GUILD_INTEGRATIONS',
      'GUILD_WEBHOOKS',
      'GUILD_INVITES',
      'GUILD_VOICE_STATES',
      'GUILD_PRESENCES',
      'GUILD_MESSAGES',
      'GUILD_MESSAGE_REACTIONS',
      'GUILD_MESSAGE_TYPING',
      'DIRECT_MESSAGES',
      'DIRECT_MESSAGE_REACTIONS',
      'DIRECT_MESSAGE_TYPING',
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'USER', 'REACTION'],
  },
  {
    prefix: '1',
    rootPath: __dirname,
    slashCommands: {
      autoRegister: true,
      guild: '841691775987089418',
    },
  },
)

// client.registry.registerModule(new TestModule(client))

client.registry.loadModule('test')

client.login(config.token)
