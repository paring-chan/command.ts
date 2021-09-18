import { Collection, Guild, GuildChannel, GuildMember, Message, Role, TextChannel, ThreadChannel, User } from 'discord.js'

export interface CoolDownAdapter {
  get(id: string): Promise<number | undefined>
  set(id: string, value: number): Promise<void>
}

export class DefaultCoolDownAdapter implements CoolDownAdapter {
  map = new Collection<string, number>()
  async get(id: string): Promise<number | undefined> {
    return this.map.get(id)
  }

  async set(id: string, value: number) {
    this.map.set(id, value)
    return
  }
}
