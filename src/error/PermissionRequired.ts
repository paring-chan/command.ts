/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { GuildMember, Permissions } from 'discord.js'

export class UserPermissionRequired extends Error {
  constructor(public user: GuildMember, public permissions: Permissions) {
    super()
  }
}

export class ClientPermissionRequired extends Error {
  constructor(public permissions: Permissions) {
    super()
  }
}
