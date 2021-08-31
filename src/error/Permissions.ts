import { Command, SlashCommand } from '../types'
import { CommandInteraction, Message, PermissionResolvable } from 'discord.js'

export class MissingUserPermissions extends Error {
  constructor(
    public command: Command,
    public missingPermissions: PermissionResolvable,
    public msg: Message,
  ) {
    super()
  }
}

export class MissingClientPermissions extends Error {
  constructor(
    public command: Command,
    public missingPermissions: PermissionResolvable,
    public msg: Message,
  ) {
    super()
  }
}

export class MissingSlashUserPermissions extends Error {
  constructor(
    public command: SlashCommand,
    public missingPermissions: PermissionResolvable,
    public interaction: CommandInteraction,
  ) {
    super()
  }
}

export class MissingSlashClientPermissions extends Error {
  constructor(
    public command: SlashCommand,
    public missingPermissions: PermissionResolvable,
    public interaction: CommandInteraction,
  ) {
    super()
  }
}

export class OwnerOnlyCommand extends Error {
  constructor(public command: Command, public msg: Message) {
    super()
  }
}

export class OwnerOnlySlashCommand extends Error {
  constructor(
    public command: SlashCommand,
    public interaction: CommandInteraction,
  ) {
    super()
  }
}
