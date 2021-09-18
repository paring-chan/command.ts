export class CoolDownError extends Error {
  constructor(public endsAt: Date) {
    super()
  }
}
