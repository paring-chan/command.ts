/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

import { Module } from '../structures'
import { KBuiltInModule } from '../constants'

export class BuiltInModule extends Module {
  constructor() {
    super()
    Reflect.defineMetadata(KBuiltInModule, true, this)
  }
}
