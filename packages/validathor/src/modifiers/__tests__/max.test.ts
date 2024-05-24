import { ValidationError, TypeError } from '@/utils/errors/errors'

import { max } from '../max'

describe('max()', () => {
  it('should be named correctly', () => {
    expect(max(6).name).toEqual('max')
  })

  it('should work with numbers', () => {
    const modifier = max(6)

    expect(modifier.validate(4)).toEqual(4)
    expect(() => modifier.validate(420)).toThrowError(
      new ValidationError('Value must be at most 6 or less'),
    )
    expect(() => max(-6).validate(4)).toThrowError(
      new ValidationError('Maximum length must be a positive number'),
    )
  })

  it('should work with strings', () => {
    const modifier = max(6)

    expect(modifier.validate('hello')).toEqual('hello')
    expect(() => modifier.validate('hello world')).toThrowError(
      new ValidationError('Value must be at most 6 characters long'),
    )
    expect(() => max(-6).validate('hello')).toThrowError(
      new ValidationError('Maximum length must be a positive number'),
    )
  })

  it('should work with dates', () => {
    const modifier = max(new Date('2018-03-06'))

    expect(modifier.validate(new Date('2015-11-01'))).toEqual(new Date('2015-11-01'))
    expect(() => modifier.validate(new Date('2024-05-10'))).toThrowError(
      new TypeError('Value must be at most 2018-03-06T00:00:00.000Z'),
    )
    expect(() => max(new Date('')).validate(new Date('2015-11-01'))).toThrowError(
      new TypeError('Maximum date must be a valid date'),
    )
  })

  it('should error on invalid input', () => {
    const modifier = max(10)

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(null)).toThrowError(new TypeError('Expected a valid value'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(false)).toThrowError(new TypeError('Expected a valid value'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(undefined)).toThrowError(new TypeError('Expected a valid value'))
    expect(() => modifier.validate(NaN)).toThrowError(new TypeError('Expected a finite number'))
    expect(() => modifier.validate(Infinity)).toThrowError(
      new TypeError('Expected a finite number'),
    )
  })

  it('should work with custom error message', () => {
    const modifier = max(4, { error: 'Invalid value', type_error: 'Invalid type' })

    expect(() => modifier.validate(9)).toThrowError(new ValidationError('Invalid value'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(null)).toThrowError(new ValidationError('Invalid type'))
    expect(() =>
      max(new Date('2018-03-06'), {
        error: 'Date too far in the future',
      }).validate(new Date('2024-05-10')),
    ).toThrowError(new ValidationError('Date too far in the future'))
    expect(() =>
      max(-420, { max_length_error: 'Stay positive man' }).validate('hello'),
    ).toThrowError(new ValidationError('Stay positive man'))
  })
})
