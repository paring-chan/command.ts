import { Module, Registry } from '../structures'
import { Collection } from 'discord.js'
import { CheckFunction, ISlashCommandDecorator, SlashCommand } from '../types'
import {
  COMMANDS_CHECK_KEY,
  COMMANDS_KEY,
  COMMANDS_OWNER_ONLY_KEY,
  SLASH_COMMANDS_KEY,
} from '../constants'

export class SlashCommandManager {
  constructor(private registry: Registry) {}

  commands: Collection<Module, SlashCommand[]> = new Collection()

  get commandList(): SlashCommand[] {
    const result: SlashCommand[] = []
    this.commands.forEach((x) => result.push(...x))
    return result
  }

  async refreshCommands() {
    const c = this.registry.client

    const app = c.application!

    if (c.commandOptions.slashCommands.autoRegister) {
      console.log('[command.ts] Updating commands...')
      if (c.commandOptions.slashCommands.guild) {
        console.log(
          `[command.ts] Target Guild ID: ${c.commandOptions.slashCommands.guild}`,
        )
        const guild = c.guilds.cache.get(c.commandOptions.slashCommands.guild)
        if (!guild)
          return console.log(
            `[command.ts] ${c.commandOptions.slashCommands.guild} Command creation cancelled.`,
          )
        for (const command of this.commandList) {
          console.log(`[command.ts] Registering command: ${command.name}`)
          const c = guild.commands.cache.find((x) => x.name === command.name)
          if (!c) {
            await guild.commands.create({
              name: command.name,
              description: command.description,
              options: command.options,
            })
          } else {
            await guild.commands.edit(c, {
              name: command.name,
              description: command.description,
              options: command.options,
            })
          }
        }
      } else {
        console.log(`[command.ts] Target: Global`)
        for (const command of this.commandList) {
          console.log(`[command.ts] Registering command: ${command.name}`)
          const c = app.commands.cache.find((x) => x.name === command.name)
          if (!c) {
            await app.commands.create({
              name: command.name,
              description: command.description,
              options: command.options,
            })
          } else {
            await app.commands.edit(c, {
              name: command.name,
              description: command.description,
              options: command.options,
            })
          }
        }
      }
    }
  }

  private registerCommands(module: Module) {
    const decorators: ISlashCommandDecorator[] = Reflect.getMetadata(
      SLASH_COMMANDS_KEY,
      module,
    )
    if (!decorators) return
    const commands: SlashCommand[] = decorators.map((v) => ({
      module: module,
      name: v.name,
      execute: Reflect.get(module, v.key),
      description: v.description,
      options: v.options,
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
