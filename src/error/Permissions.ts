import { Command, SlashCommand } from '../types'
import { PermissionResolvable } from 'discord.js'

export class MissingUserPermissions extends Error {
  constructor(
    public command: Command,
    public missingPermissions: PermissionResolvable,
  ) {
    super()
  }
}

export class MissingClientPermissions extends Error {
  constructor(
    public command: Command,
    public missingPermissions: PermissionResolvable,
  ) {
    super()
  }
}

export class MissingSlashUserPermissions extends Error {
  constructor(
    public command: SlashCommand,
    public missingPermissions: PermissionResolvable,
  ) {
    super()
  }
}

export class MissingSlashClientPermissions extends Error {
  constructor(
    public command: SlashCommand,
    public missingPermissions: PermissionResolvable,
  ) {
    super()
  }
}
