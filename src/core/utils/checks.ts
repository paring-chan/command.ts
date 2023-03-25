import type { Interaction } from 'discord.js'
import { BaseInteraction, Message } from 'discord.js'
import { createComponentHook } from '../hooks'
import type { ComponentHookFn } from '../hooks/componentHook'
import type { CommandClient } from '../structures'
import { OwnerOnlyError } from './errors'

export const createCheckDecorator = (fn: ComponentHookFn<[CommandClient, Interaction | Message]>) => createComponentHook('beforeCall', fn)

export const ownerOnly = createCheckDecorator(async (client: CommandClient, i: Interaction | Message) => {
  let isOwner = false

  if (i instanceof BaseInteraction) {
    client
    isOwner = await client.isOwner(i.user)
  } else if (i instanceof Message) {
    isOwner = await client.isOwner(i.author)
  }

  if (!isOwner) throw new OwnerOnlyError()
})
