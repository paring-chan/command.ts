/*
* File: ComponentArgument.ts
* 
* Copyright (c) 2022-2022 pikokr
* 
* Licensed under MIT License. Please see more defails in LICENSE file.
*/

import { ComponentArgumentDecorator } from './ComponentArgumentDecorator'

export class ComponentArgument {
  decorators: ComponentArgumentDecorator[] = []

  constructor(public type: unknown) {}
}
