import { Module } from '../structures'
import { KBuiltInModule } from '../constants'

export class BuiltInModule extends Module {
  constructor() {
    super()
    Reflect.defineMetadata(KBuiltInModule, true, this)
  }
}
