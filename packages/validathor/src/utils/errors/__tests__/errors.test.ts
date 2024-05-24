import { ValidationError, TypeError } from '../errors'

describe('ValidationError', () => {
  it('should work', () => {
    const error = new ValidationError()

    expect(error).toEqual(new Error('Validation error'))
    expect(error).toHaveProperty('name', 'ValidationError')
    expect(error).toHaveProperty('message', 'Validation error')
    expect(error).toHaveProperty('cause', undefined)
    expect(error).toHaveProperty('stack', expect.any(String))
  })

  it('should work with a message', () => {
    const error = new ValidationError('oh no')

    expect(error).toEqual(new Error('oh no'))
    expect(error).toHaveProperty('name', 'ValidationError')
    expect(error).toHaveProperty('message', 'oh no')
    expect(error).toHaveProperty('cause', undefined)
    expect(error).toHaveProperty('stack', expect.any(String))
  })

  it('should work with a cause', () => {
    const error = new ValidationError('oops', new Error('not again'))

    expect(error).toEqual(new Error('oops'))
    expect(error).toHaveProperty('name', 'ValidationError')
    expect(error).toHaveProperty('message', 'oops')
    expect(error).toHaveProperty('cause', new Error('not again'))
    expect(error).toHaveProperty('stack', expect.any(String))
  })
})

describe('TypeError', () => {
  it('should work', () => {
    const error = new TypeError()

    expect(error).toEqual(new Error('Type error'))
    expect(error).toHaveProperty('name', 'TypeError')
    expect(error).toHaveProperty('message', 'Type error')
    expect(error).toHaveProperty('cause', undefined)
    expect(error).toHaveProperty('stack', expect.any(String))
  })

  it('should work with a message', () => {
    const error = new TypeError('oh no')

    expect(error).toEqual(new Error('oh no'))
    expect(error).toHaveProperty('name', 'TypeError')
    expect(error).toHaveProperty('message', 'oh no')
    expect(error).toHaveProperty('cause', undefined)
    expect(error).toHaveProperty('stack', expect.any(String))
  })

  it('should work with a cause', () => {
    const error = new TypeError('oops', new Error('not again'))

    expect(error).toEqual(new Error('oops'))
    expect(error).toHaveProperty('name', 'TypeError')
    expect(error).toHaveProperty('message', 'oops')
    expect(error).toHaveProperty('cause', new Error('not again'))
    expect(error).toHaveProperty('stack', expect.any(String))
  })
})
