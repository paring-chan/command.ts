import { Module, Registry } from '../structures'
import { Collection } from 'discord.js'
import { CheckFunction, ISlashCommandDecorator, SlashCommand } from '../types'
import {
  COMMANDS_CHECK_KEY,
  COMMANDS_KEY,
  COMMANDS_OWNER_ONLY_KEY,
  SLASH_COMMANDS_KEY,
} from '../constants'

/**
 * Slash Command Manager.
 */
export class SlashCommandManager {
  constructor(private registry: Registry) {}

  /**
   * Collection of slash commands
   */
  commands: Collection<Module, SlashCommand[]> = new Collection()

  /**
   * Get List of slash commands
   */
  get commandList(): SlashCommand[] {
    const result: SlashCommand[] = []
    this.commands.forEach((x) => result.push(...x))
    return result
  }

  /**
   * Auto-Refresh slash command list if `autoRegister` config enabled on client
   */
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
        await guild.commands.set(
          this.commandList.map((x) => ({
            name: x.name,
            description: x.description,
            options: x.options,
          })),
        )
      } else {
        console.log(`[command.ts] Target: Global`)
        await app.commands.set(
          this.commandList.map((x) => ({
            name: x.name,
            description: x.description,
            options: x.options,
          })),
        )
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

  /**
   * This method is run by Registry. You don't have to run it manually.
   * @param module
   */
  register(module: Module) {
    this.registerCommands(module)
  }

  /**
   * This method is run by Registry. You don't have to run it manually.
   * @param module
   */
  unregister(module: Module) {
    this.commands.delete(module)
  }
}
