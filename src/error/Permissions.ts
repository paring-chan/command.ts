import { Command } from '../types'
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
