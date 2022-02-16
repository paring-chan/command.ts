/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { createCheckDecorator } from '../utils'
import { CoolDownType } from './type'
import { DMChannel, GuildMember, TextChannel } from 'discord.js'
import { CoolDownError } from './error'

export const coolDown = (type: CoolDownType, seconds: number) =>
  createCheckDecorator(
    async (msg) => {
      const a = msg.data.cts.coolDownAdapter
      const getKey = (): string => {
        switch (type) {
          case CoolDownType.USER:
            return msg.author.id
          case CoolDownType.GUILD:
            return (msg.guild || msg.author).id
          case CoolDownType.CHANNEL:
            return msg.channel.id
          case CoolDownType.MEMBER:
            return `${msg.guild?.id}.${msg.author.id}`
          case CoolDownType.ROLE:
            return (msg.channel instanceof DMChannel ? msg.channel : msg.member!.roles.highest).id
          case CoolDownType.CATEGORY:
            return ((msg.channel as TextChannel).parent || msg.channel).id
        }
      }
      const key = getKey() + '-command-' + msg.data.command?.name
      const data = await a.get(key)
      const now = Date.now()
      if (!data || !(now - data < seconds * 1000)) {
        await a.set(key, now)
        return true
      }
      throw new CoolDownError(new Date(data + seconds * 1000))
    },
    async (i) => {
      if (i.isMessageComponent()) return true
      const a = i.data.cts.coolDownAdapter
      const getKey = (): string => {
        switch (type) {
          case CoolDownType.USER:
            return i.user.id + '.user'
          case CoolDownType.GUILD:
            return (i.guild || i.user).id + '.guild'
          case CoolDownType.CHANNEL:
            return i.channel!.id + '.channel'
          case CoolDownType.MEMBER:
            return `${i.guild?.id}.${i.user.id}` + '.member'
          case CoolDownType.ROLE:
            return (i.channel instanceof DMChannel ? i.channel : (i.member as GuildMember)!.roles.highest).id + '.role'
          case CoolDownType.CATEGORY:
            return ((i.channel as TextChannel).parent || i.channel!).id + '.category'
        }
      }
      const key = getKey() + '-applicationCommand-' + i.commandName
      const data = await a.get(key)
      const now = Date.now()
      if (!data || !(now - data < seconds * 1000)) {
        await a.set(key, now)
        return true
      }
      throw new CoolDownError(new Date(data + seconds * 1000))
    },
  )
