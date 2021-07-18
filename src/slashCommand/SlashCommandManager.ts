import { Module, Registry } from '../structures'
import { Collection } from 'discord.js'
import { CheckFunction, ISlashCommandDecorator, SlashCommand } from '../types'
import {
  COMMANDS_CHECK_KEY,
  COMMANDS_KEY,
  COMMANDS_OWNER_ONLY_KEY,
} from '../constants'

export class SlashCommandManager {
  constructor(private registry: Registry) {}

  commands: Collection<Module, SlashCommand[]> = new Collection()

  get commandList(): SlashCommand[] {
    const result: SlashCommand[] = []
    this.commands.forEach((x) => result.push(...x))
    return result
  }

  private registerCommands(module: Module) {
    const decorators: ISlashCommandDecorator[] = Reflect.getMetadata(
      COMMANDS_KEY,
      module,
    )
    const ownerOnlyKeys: Set<string> =
      Reflect.getMetadata(COMMANDS_OWNER_ONLY_KEY, module) || new Set()
    const checks: CheckFunction[] =
      Reflect.getMetadata(COMMANDS_CHECK_KEY, module) || []
    if (!decorators) return
    const commands: SlashCommand[] = decorators.map((v) => ({
      args: v.args,
      module: module,
      name: v.name,
      execute: Reflect.get(module, v.key),
      ownerOnly: ownerOnlyKeys.has(v.key),
      checks,
    }))
    this.commands.set(module, commands)
  }

  register(module: Module) {
    this.registerCommands(module)
  }

  unregister(module: Module) {
    this.commands.delete(module)
  }
}
