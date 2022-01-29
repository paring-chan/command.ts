/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Collection } from 'discord.js'

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
