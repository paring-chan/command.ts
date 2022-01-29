/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

export class CoolDownError extends Error {
  constructor(public endsAt: Date) {
    super()
  }
}
