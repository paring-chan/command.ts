/*
* File: TextCommand.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { createComponentDecorator } from '../core/components/decoratorCreator'
import { BaseComponent } from '../core/components/BaseComponent'

type TextCommandOptions = {
  name: string
  aliases?: string
  description?: string
}

export class TextCommandComponent extends BaseComponent<TextCommandOptions> {}

export const command = createComponentDecorator(TextCommandComponent)
