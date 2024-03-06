import { ValidationError, TypeError } from '@/utils/errors'

import { minLength } from '../minLength'

describe('minLength()', () => {
  it('should work', () => {
    const modifier1 = minLength(2)
    // @ts-expect-error: Passing wrong value on purpose
    const modifier2 = minLength('invalid')

    expect(modifier1.name).toEqual('minLength')
    expect(modifier1.validate('foo')).toEqual('foo')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier1.validate(123)).toThrowError(new TypeError('Expected a string'))
    expect(() => modifier2.validate('invalid')).toThrowError(new TypeError('Expected a number'))
  })

  it('should work with custom error message', () => {
    const modifier1 = minLength(4, { error: 'Invalid value' })
    const modifier2 = minLength(2, { type_error: 'Invalid type' })
    // @ts-expect-error: Passing wrong value on purpose
    const modifier3 = minLength('invalid', { type_error: 'Invalid type' })
    const modifier4 = minLength(-6, { min_length_error: 'Negative numbers not allowed' })
    const modifier5 = minLength(6, { error: 'Too short' })

    expect(() => modifier1.validate('foo')).toThrowError(new ValidationError('Invalid value'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier2.validate(123)).toThrowError(new TypeError('Invalid type'))
    expect(() => modifier3.validate('foo')).toThrowError(new TypeError('Invalid type'))
    expect(() => modifier4.validate('foo')).toThrowError(
      new ValidationError('Negative numbers not allowed'),
    )
    expect(() => modifier5.validate('foo')).toThrowError(new ValidationError('Too short'))
  })
})
