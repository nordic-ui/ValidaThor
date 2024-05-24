import { ValidationError, TypeError } from '@/utils/errors/errors'

import { min } from '../min'

describe('min()', () => {
  it('should be named correctly', () => {
    expect(min(2).name).toEqual('min')
  })

  it('should work with numbers', () => {
    const modifier = min(2)

    expect(modifier.validate(4)).toEqual(4)
    expect(() => modifier.validate(0)).toThrowError(
      new ValidationError('Value must be at least 2 or more'),
    )
    expect(() => min(-6).validate(4)).toThrowError(
      new ValidationError('Minimum length must be a positive number'),
    )
  })

  it('should work with strings', () => {
    const modifier = min(3)

    expect(modifier.validate('hello')).toEqual('hello')
    expect(() => modifier.validate('hi')).toThrowError(
      new ValidationError('Value must be at least 3 characters long'),
    )
    expect(() => min(-6).validate('hello')).toThrowError(
      new ValidationError('Minimum length must be a positive number'),
    )
  })

  it('should work with dates', () => {
    const modifier = min(new Date('2015-11-01'))

    expect(modifier.validate(new Date('2018-03-06'))).toEqual(new Date('2018-03-06'))
    expect(() => modifier.validate(new Date('1970-01-01'))).toThrowError(
      new TypeError('Value must be at least 2015-11-01T00:00:00.000Z'),
    )
    expect(() => min(new Date('')).validate(new Date('2015-11-01'))).toThrowError(
      new TypeError('Minimum date must be a valid date'),
    )
  })

  it('should error on invalid input', () => {
    const modifier = min(10)

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
    const modifier1 = min(4, { error: 'Value too small', type_error: 'Invalid type' })

    expect(() => modifier1.validate(1)).toThrowError(new ValidationError('Value too small'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier1.validate(null)).toThrowError(new ValidationError('Invalid type'))
    expect(() =>
      min(-420, { min_length_error: 'Stay positive man' }).validate('hello'),
    ).toThrowError(new ValidationError('Stay positive man'))
  })
})
