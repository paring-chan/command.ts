import { Collection, Guild, GuildChannel, GuildMember, Role, TextChannel, ThreadChannel, User } from 'discord.js'

export interface CoolDownAdapter {
  user(user: User): Promise<number | null>
  member(member: GuildMember): Promise<number | null>
  role(role: Role): Promise<number | null>
  channel(channel: GuildChannel): Promise<number | null>
  guild(guild: Guild): Promise<number | null>

  setUser(user: User, data: number): Promise<void>
  setMember(member: GuildMember, data: number): Promise<void>
  setRole(role: Role, data: number): Promise<void>
  setChannel(channel: GuildChannel, data: number): Promise<void>
  setGuild(guild: Guild, data: number): Promise<void>
}

export class DefaultCoolDownAdapter implements CoolDownAdapter {
  userMap = new Collection<User, number>()
  memberMap = new Collection<GuildMember, number>()
  roleMap = new Collection<Role, number>()
  guildMap = new Collection<Guild, number>()
  channelMap = new Collection<GuildChannel, number>()

  async user(user: User): Promise<number | null> {
    return this.userMap.get(user) || null
  }
  async member(member: GuildMember): Promise<number | null> {
    return this.memberMap.get(member) || null
  }
  async role(role: Role): Promise<number | null> {
    return this.roleMap.get(role) || null
  }
  async guild(guild: Guild): Promise<number | null> {
    return this.guildMap.get(guild) || null
  }
  async channel(channel: GuildChannel): Promise<number | null> {
    return this.channelMap.get(channel) || null
  }

  async setRole(role: Role, data: number) {
    this.roleMap.set(role, data)
  }
  async setUser(user: User, data: number) {
    this.userMap.set(user, data)
  }
  async setGuild(guild: Guild, data: number) {
    this.guildMap.set(guild, data)
  }
  async setChannel(channel: GuildChannel, data: number) {
    this.channelMap.set(channel, data)
  }
  async setMember(member: GuildMember, data: number) {
    this.memberMap.set(member, data)
  }
}
