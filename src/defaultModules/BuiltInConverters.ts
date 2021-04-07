import { argConverter, Module } from '..'
import { User } from 'discord.js'

export class BuiltInConverters extends Module {
  @argConverter(User)
  async user(value: string) {}
}
