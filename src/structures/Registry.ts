import { CommandClient } from './CommandClient'
import { Module } from './Module'
import { Command } from '../command'

export class Registry {
  constructor(private client: CommandClient) {}

  modules: Module[] = []

  commands: Command[] = []

  registerModule(module: Module) {
    // TODO
  }

  loadModule(path: string, absolute: boolean = false) {
    // TODO
  }

  unregisterModule(module: Module) {
    // TODO
  }

  unloadModule(module: Module) {
    // TODO
  }
}
