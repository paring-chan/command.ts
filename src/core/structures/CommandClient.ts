import { Client } from 'discord.js'
import EventEmitter from 'events'
import { Registry } from './Registry'

export class CommandClient extends EventEmitter {
  registry = new Registry()

  constructor(public discord: Client) {
    super()

    this.registry.registerEventEmitter('cts', this)
    this.registry.registerEventEmitter('discord', this.discord)
  }
}
