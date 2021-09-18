import { createCheckDecorator } from '../utils'
import { CoolDownType } from './type'
import { DMChannel, TextChannel } from 'discord.js'
import { CoolDownError } from './error'

export const coolDown = (type: CoolDownType, seconds: number) =>
  createCheckDecorator(async (msg) => {
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
    const key = getKey()
    const data = await a.get(key)
    const now = Date.now()
    if (!data || !(now - data < seconds * 1000)) {
      await a.set(key, now)
      return true
    }
    throw new CoolDownError(new Date(data + seconds * 1000))
  })
