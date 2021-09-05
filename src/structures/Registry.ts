import { CommandClient } from './CommandClient'
import { Module } from './Module'
import { Command } from '../command'

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Module[] = []

  commands: Command[] = []

  registerModule() {
    // TODO
  }

  loadModule() {
    // TODO
  }
}
