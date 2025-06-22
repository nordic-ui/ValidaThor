import { parse } from '@/core/parse'
import { custom, max, min, enumerator } from '@/modifiers'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { number } from '../number'

describe('number()', () => {
  it('should be named correctly', () => {
    expect(number().name).toEqual('number')
  })

  it('should work with no modifiers', () => {
    const schema = number()

    expect(parse(schema, 123)).toEqual(123)
    expect(parse(schema, 123.123)).toEqual(123.123)

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Expected a number'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a number'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => 123)).toThrowError(new TypeError('Expected a number'))
    expect(() => parse(schema, NaN)).toThrowError(new TypeError('Expected a finite number'))
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(() => parse(schema, 3e333)).toThrowError(new TypeError('Expected a finite number'))
    expect(() => parse(schema, Infinity)).toThrowError(new TypeError('Expected a finite number'))
  })

  it('should work with custom error message', () => {
    const schema = number([], { type_error: 'Invalid value' })

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Invalid value'))
  })

  it('should work with min() and max() modifiers', () => {
    const schema1 = number([min(2)])
    const schema2 = number([max(6)])
    const schema3 = number([min(2), max(6)])
    const schema4 = number([min(2, { error: 'Value too small' })])
    const schema5 = number([max(6, { error: 'Value too large' })])

    expect(parse(schema1, 3)).toEqual(3)
    expect(parse(schema2, 5)).toEqual(5)
    expect(parse(schema3, 4)).toEqual(4)

    expect(() => parse(schema1, 1)).toThrowError(
      new ValidationError('Value must be at least 2 or more'),
    )
    expect(() => parse(schema2, 7)).toThrowError(
      new ValidationError('Value must be at most 6 or less'),
    )
    expect(() => parse(schema3, 7)).toThrowError(
      new ValidationError('Value must be at most 6 or less'),
    )
    expect(() => parse(schema3, 1)).toThrowError(
      new ValidationError('Value must be at least 2 or more'),
    )
    expect(() => parse(schema4, 1)).toThrowError(new ValidationError('Value too small'))
    expect(() => parse(schema5, 7)).toThrowError(new ValidationError('Value too large'))
  })

  it('should work with enumerator() modifier', () => {
    const schema = number([enumerator([1, 2, 3, 4, 5])])

    expect(parse(schema, 1)).toEqual(1)
    expect(parse(schema, 3)).toEqual(3)

    expect(() => parse(schema, 420)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => parse(schema, 'invalid')).toThrowError(new ValidationError('Expected a number'))
  })

  it('should work with custom() modifier', () => {
    const schema1 = number([
      custom((value) => [[typeof value === 'number', new TypeError('Expected a number')]]),
    ])
    const schema2 = number([
      custom((value) => [[typeof value === 'string', new TypeError('Expected a string')]]),
    ])

    expect(() => parse(schema1, '123')).toThrowError(new ValidationError('Expected a number'))
    expect(() => parse(schema2, 123)).toThrowError(new ValidationError('Expected a string'))
  })
})
