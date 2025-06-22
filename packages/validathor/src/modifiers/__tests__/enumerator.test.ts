import { parse } from '@/core/parse'
import { string, number } from '@/schemas'
import { TypeError, ValidationError } from '@/utils/errors/errors'

import { enumerator } from '../enumerator'

// Test TypeScript enums
enum StringEnum {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

enum NumericEnum {
  Zero,
  One,
  Two,
}

enum MixedEnum {
  A = 'a',
  B = 1,
  C = 'c',
}

describe('enumerator()', () => {
  it('should be named correctly', () => {
    expect(enumerator([]).name).toEqual('enumerator')
  })

  it('should work with strings', () => {
    const modifier = enumerator(['hello', 'world'])

    expect(modifier.validate('hello')).toEqual('hello')
    expect(() => modifier.validate('fart')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => modifier.validate('')).toThrowError(
      new ValidationError('Expected a non-empty input'),
    )
  })

  it('should work with numbers', () => {
    const modifier = enumerator([1, 2, 420])

    expect(modifier.validate(420)).toEqual(420)
    expect(() => modifier.validate(69)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => modifier.validate(NaN)).toThrowError(new TypeError('Expected a finite number'))
  })

  it('should error on invalid input', () => {
    const modifier = enumerator([1, 2, 420])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(null)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(false)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(undefined)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => modifier.validate(NaN)).toThrowError(new TypeError('Expected a finite number'))
    expect(() => modifier.validate(Infinity)).toThrowError(
      new TypeError('Expected a finite number'),
    )
  })

  it('should error on invalid string input', () => {
    const modifier = enumerator(['hello', 'world'])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate(69)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should error on invalid number input', () => {
    const modifier = enumerator([1, 2, 420])

    // @ts-expect-error - Testing invalid input
    expect(() => modifier.validate('hello')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should error on empty input', () => {
    const modifier = enumerator([])

    expect(() => modifier.validate('hello')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should work with TypeScript string enum', () => {
    const modifier = enumerator(StringEnum)

    expect(modifier.validate(StringEnum.Red)).toEqual('red')
    expect(modifier.validate(StringEnum.Green)).toEqual('green')
    expect(modifier.validate(StringEnum.Blue)).toEqual('blue')

    expect(() => modifier.validate('yellow')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should work with TypeScript numeric enum', () => {
    const modifier = enumerator(NumericEnum)

    expect(modifier.validate(NumericEnum.Zero)).toEqual(0)
    expect(modifier.validate(NumericEnum.One)).toEqual(1)
    expect(modifier.validate(NumericEnum.Two)).toEqual(2)

    expect(() => modifier.validate(3)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should work with TypeScript mixed enum', () => {
    const modifier = enumerator(MixedEnum)

    expect(modifier.validate(MixedEnum.A)).toEqual('a')
    expect(modifier.validate(MixedEnum.B)).toEqual(1)
    expect(modifier.validate(MixedEnum.C)).toEqual('c')

    expect(() => modifier.validate('b')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => modifier.validate(2)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should enforce type constraints with enums', () => {
    const stringModifier = enumerator(StringEnum)
    const numericModifier = enumerator(NumericEnum)

    // String enum should reject empty strings
    expect(() => stringModifier.validate('')).toThrowError(
      new ValidationError('Expected a non-empty input'),
    )

    // Numeric enum should reject non-finite numbers
    expect(() => numericModifier.validate(NaN)).toThrowError(
      new TypeError('Expected a finite number'),
    )
    expect(() => numericModifier.validate(Infinity)).toThrowError(
      new TypeError('Expected a finite number'),
    )
  })

  it('should work with string schema and TypeScript enums', () => {
    // For string enums, we need to use the enum values directly
    const schema = string([enumerator(['red', 'green', 'blue'])])

    expect(parse(schema, 'red')).toEqual('red')
    expect(parse(schema, 'blue')).toEqual('blue')

    expect(() => parse(schema, 'yellow')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a string'))
  })

  it('should work with number schema and TypeScript enums', () => {
    // For numeric enums, we need to use the enum values directly
    const schema = number([enumerator([0, 1, 2])])

    expect(parse(schema, 0)).toEqual(0)
    expect(parse(schema, 2)).toEqual(2)

    expect(() => parse(schema, 5)).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
    expect(() => parse(schema, 'invalid')).toThrowError(new TypeError('Expected a number'))
  })
})
