import { createCheckDecorator } from '../utils'
import { CoolDownType } from './type'

export const coolDown = (type: CoolDownType, seconds: number) =>
  createCheckDecorator((msg) => {
    msg.data.cts
    return true
  })
