import { parse } from '../../core/parse'
import { max, min } from '../../modifiers'
import { ValidationError, TypeError } from '../../utils/errors'
import { number } from '../number'

describe('number()', () => {
  it('should work with no args', () => {
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
    const schema = number([], 'Invalid value')

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Invalid value'))
  })

  it('should work with min() and max() args', () => {
    const schema1 = number([min(2)])
    const schema2 = number([max(6)])
    const schema3 = number([min(2), max(6)])
    const schema4 = number([min(2, { error: 'Value too small' })])
    const schema5 = number([max(6, { error: 'Value too large' })])

    expect(parse(schema1, 3)).toEqual(3)
    expect(parse(schema2, 5)).toEqual(5)
    expect(parse(schema3, 4)).toEqual(4)

    expect(() => parse(schema1, 1)).toThrowError(new ValidationError('Minimum value not met'))
    expect(() => parse(schema2, 7)).toThrowError(new ValidationError('Maximum value exceeded'))
    expect(() => parse(schema3, 7)).toThrowError(new ValidationError('Maximum value exceeded'))
    expect(() => parse(schema4, 1)).toThrowError(new ValidationError('Value too small'))
    expect(() => parse(schema5, 7)).toThrowError(new ValidationError('Value too large'))
  })
})
