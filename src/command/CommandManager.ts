import { Module } from '../structures'
import { Collection } from 'discord.js'
import {
  ArgConverter,
  CheckFunction,
  Command,
  IArgConverterDecorator,
  ICommandDecorator,
  RequiredPermissions,
} from '../types'
import {
  ARG_CONVERTER_KEY,
  COMMANDS_CHECK_KEY,
  COMMANDS_CLIENT_PERMISSIONS_KEY,
  COMMANDS_KEY,
  COMMANDS_OWNER_ONLY_KEY,
  COMMANDS_USER_PERMISSIONS_KEY,
} from '../constants'

/**
 * Command Manager
 */
export class CommandManager {
  commands: Collection<Module, Command[]> = new Collection()
  argumentConverters: Collection<Module, ArgConverter[]> = new Collection()

  get commandList(): Command[] {
    const result: Command[] = []
    this.commands.forEach((x) => result.push(...x))
    return result
  }

  get argConverterList(): ArgConverter[] {
    const result: ArgConverter[] = []
    this.argumentConverters.forEach((x) => result.push(...x))
    return result
  }

  private registerCommands(module: Module) {
    const decorators: ICommandDecorator[] = Reflect.getMetadata(
      COMMANDS_KEY,
      module,
    )
    const ownerOnlyKeys: Set<string> =
      Reflect.getMetadata(COMMANDS_OWNER_ONLY_KEY, module) || new Set()
    if (!decorators) return
    const commands: Command[] = decorators.map((v) => {
      const checks: CheckFunction[] =
        Reflect.getMetadata(COMMANDS_CHECK_KEY, module, v.key) || []
      const userPerms: RequiredPermissions = Reflect.getMetadata(
        COMMANDS_USER_PERMISSIONS_KEY,
        module,
        v.key,
      ) || { permissions: [] }

      const clientPerms: RequiredPermissions = Reflect.getMetadata(
        COMMANDS_CLIENT_PERMISSIONS_KEY,
        module,
        v.key,
      ) || { permissions: [] }

      return {
        usesCtx: v.usesCtx,
        args: v.args,
        brief: v.brief,
        description: v.description,
        module: module,
        name: v.name,
        execute: Reflect.get(module, v.key),
        aliases: v.aliases,
        ownerOnly: ownerOnlyKeys.has(v.key),
        checks,
        userPermissions: userPerms.permissions,
        clientPermissions: clientPerms.permissions,
      }
    })
    this.commands.set(module, commands)
  }

  registerArgConverter(module: Module) {
    const decorators: IArgConverterDecorator[] = Reflect.getMetadata(
      ARG_CONVERTER_KEY,
      module,
    )
    if (!decorators) return
    const converters: ArgConverter[] = decorators.map((v) => ({
      convert: Reflect.get(module, v.key),
      type: v.type,
      module: module,
    }))
    this.argumentConverters.set(module, converters)
  }

  register(module: Module) {
    this.registerArgConverter(module)
    this.registerCommands(module)
  }

  unregister(module: Module) {
    this.commands.delete(module)
  }
}
