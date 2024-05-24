import { parse } from '@/core/parse'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { regex } from '../regex'

describe('regex()', () => {
  it('should be named correctly', () => {
    expect(regex().name).toEqual('regex')
  })

  it('should work with no modifiers', () => {
    const schema = regex()

    expect(parse(schema, /hello world/)).toEqual(/hello world/)

    expect(() => parse(schema, 'hello world')).toThrowError(
      new TypeError('Expected a valid RegExp'),
    )
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a valid RegExp'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a valid RegExp'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => /hello world/)).toThrowError(
      new TypeError('Expected a valid RegExp'),
    )
  })

  it('should work with custom error message', () => {
    const schema = regex({ type_error: 'Invalid regex' })

    expect(() => parse(schema, 123)).toThrowError(new ValidationError('Invalid regex'))
  })
})
