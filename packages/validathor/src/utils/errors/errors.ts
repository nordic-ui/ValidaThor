export class ValidationError extends Error {
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Validation error')
    this.name = this.constructor.name
    this.cause = cause
  }
}

export class TypeError extends Error {
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Type error')
    this.name = this.constructor.name
    this.cause = cause
  }
}
