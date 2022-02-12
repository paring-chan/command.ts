/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { GuildMember } from 'discord.js'

export class UserPermissionRequired extends Error {
  constructor(public user: GuildMember, public permissions: bigint) {
    super()
  }
}

export class ClientPermissionRequired extends Error {
  constructor(public permissions: bigint) {
    super()
  }
}
