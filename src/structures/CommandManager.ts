import { Module } from './Module'
import { Collection } from 'discord.js'
import { Command } from '../types'

export class CommandManager {
  commands: Collection<Module, Command[]> = new Collection()

  register(module: Module) {}

  unregister(module: Module) {}
}
