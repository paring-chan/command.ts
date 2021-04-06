import { Collection } from 'discord.js'
import { Module } from './Module'
import { IListener } from '../types'

export class ListenerManager {
  listeners: Collection<Module, IListener> = new Collection()

  register(module: Module) {}

  unregister(module: Module) {}
}
