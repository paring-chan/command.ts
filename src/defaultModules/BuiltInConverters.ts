import { argConverter, CommandClient, Module } from '..'
import { GuildMember, Message, User } from 'discord.js'

export class BuiltInConverters extends Module {
  constructor(private client: CommandClient) {
    super(__filename)
  }

  getUserIDByMention(mention: string): `${bigint}` | undefined {
    if (!mention) return

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1)

      if (mention.startsWith('!')) {
        mention = mention.slice(1)
      }

      return mention as `${bigint}`
    }
  }

  @argConverter(User)
  user(value: string): User | null {
    const id = this.getUserIDByMention(value)
    if (!id) return null
    const user = this.client.users.cache.get(id)
    return user || null
  }

  @argConverter(GuildMember)
  member(value: string, msg: Message): GuildMember | null {
    const id = this.getUserIDByMention(value)
    if (!id) return null
    const user = msg.guild?.members.cache.get(id)
    return user || null
  }

  @argConverter(Number)
  number(value: string) {
    const n = Number(value)
    return isNaN(n) ? null : n
  }
}
