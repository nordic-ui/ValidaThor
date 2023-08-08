import { parse } from '../../core/parse'
import { ValidationError, TypeError } from '../../utils/errors'
import { regex } from '../regex'

describe('regex()', () => {
  it('should work with no args', () => {
    const schema = regex()

    expect(parse(schema, /hello world/)).toEqual(/hello world/)

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Expected a RegExp'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a RegExp'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a RegExp'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => /hello world/)).toThrowError(
      new TypeError('Expected a RegExp'),
    )
  })

  it('should work with custom error message', () => {
    const schema = regex('Invalid regex')

    expect(() => parse(schema, 123)).toThrowError(new ValidationError('Invalid regex'))
  })
})
