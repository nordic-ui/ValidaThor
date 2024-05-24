import { TypeError } from '@/utils/errors/errors'

import { enumerator } from '../enumerator'

describe('enumerator()', () => {
  it('should be named correctly', () => {
    expect(enumerator([]).name).toEqual('enumerator')
  })

  it('should work with strings', () => {
    const modifier = enumerator(['hello', 'world'])

    expect(modifier.validate('hello')).toEqual('hello')
    expect(() => modifier.validate('fart')).toThrowError(new TypeError('Expected a valid value'))
    expect(() => modifier.validate('')).toThrowError(new TypeError('Expected a valid value'))
  })

  it('should work with numbers', () => {
    const modifier = enumerator([1, 2, 420])

    expect(modifier.validate(420)).toEqual(420)
    expect(() => modifier.validate(69)).toThrowError(new TypeError('Expected a valid value'))
    expect(() => modifier.validate(NaN)).toThrowError(new TypeError('Expected a valid value'))
  })

  it('should error on invalid input', () => {
    const modifier = enumerator([1, 2, 420])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(null)).toThrowError(new TypeError('Expected a valid value'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(false)).toThrowError(new TypeError('Expected a valid value'))
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(undefined)).toThrowError(new TypeError('Expected a valid value'))
    expect(() => modifier.validate(NaN)).toThrowError(new TypeError('Expected a valid value'))
    expect(() => modifier.validate(Infinity)).toThrowError(new TypeError('Expected a valid value'))
  })

  it('should error on invalid string input', () => {
    const modifier = enumerator(['hello', 'world'])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(69)).toThrowError(new TypeError('Expected a valid value'))
  })

  it('should error on invalid number input', () => {
    const modifier = enumerator([1, 2, 420])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate('hello')).toThrowError(new TypeError('Expected a valid value'))
  })

  it('should error on empty input', () => {
    const modifier = enumerator([])

    expect(() => modifier.validate('hello')).toThrowError(new TypeError('Expected a valid value'))
  })

  // TODO: Maybe find a way of supporting this
  // it('should maybe work with mixed types', () => {
  //   const modifier = enumerator(['hello', 69])

  //   expect(modifier.validate('hello')).toEqual('hello')
  //   expect(modifier.validate(69)).toEqual(69)
  //   expect(() => modifier.validate('fart')).toThrowError(new TypeError('Expected a valid value'))
  //   expect(() => modifier.validate(420)).toThrowError(new TypeError('Expected a valid value'))
  // })
})
