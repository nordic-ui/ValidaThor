export class ValidationError extends Error {
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Validation error')
    this.cause = cause ?? new Error(message ?? 'Validation error')
    this.name = this.constructor.name
  }
}

export class TypeError extends Error {
  constructor(message?: string, cause?: Error) {
    super(message ?? 'Type error')
    this.cause = cause ?? new Error(message ?? 'Type error')
    this.name = this.constructor.name
  }
}
