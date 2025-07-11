import { parse } from '@/core/parse'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { enum_ } from '../enum'

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

describe('enum_()', () => {
  it('should work with array of strings', () => {
    const schema = enum_(['hello', 'world'])

    expect(parse(schema, 'hello')).toEqual('hello')
    expect(parse(schema, 'world')).toEqual('world')
  })

  it('should work with array of numbers', () => {
    const schema = enum_([1, 2, 420] as const)

    expect(parse(schema, 1)).toEqual(1)
    expect(parse(schema, 420)).toEqual(420)
  })

  it('should work with TypeScript string enum', () => {
    const schema = enum_(StringEnum)

    expect(parse(schema, 'red')).toEqual('red')
    expect(parse(schema, 'green')).toEqual('green')
    expect(parse(schema, 'blue')).toEqual('blue')
  })

  it('should work with TypeScript numeric enum', () => {
    const schema = enum_(NumericEnum)

    // For numeric enums, the values are the numeric values, not the names
    expect(parse(schema, 0)).toEqual(0)
    expect(parse(schema, 1)).toEqual(1)
    expect(parse(schema, 2)).toEqual(2)
  })

  it('should work with TypeScript mixed enum', () => {
    const schema = enum_(MixedEnum)

    expect(parse(schema, 'a')).toEqual('a')
    expect(parse(schema, 1)).toEqual(1)
    expect(parse(schema, 'c')).toEqual('c')
  })

  it('should work with readonly arrays', () => {
    const values = ['read', 'write', 'admin'] as const
    const schema = enum_(values)

    expect(parse(schema, 'read')).toEqual('read')
    expect(parse(schema, 'admin')).toEqual('admin')
  })

  it('should reject invalid values for array enum', () => {
    const schema = enum_(['hello', 'world'])

    expect(() => parse(schema, 'fart')).toThrowError(
      new ValidationError('Value is not a valid enum option'),
    )
    expect(() => parse(schema, 123)).toThrowError(
      new ValidationError('Value is not a valid enum option'),
    )
  })

  it('should reject invalid values for TypeScript enum', () => {
    const schema = enum_(StringEnum)

    expect(() => parse(schema, 'yellow')).toThrowError(
      new ValidationError('Value is not a valid enum option'),
    )
    expect(() => parse(schema, 'Red')).toThrowError(
      new ValidationError('Value is not a valid enum option'),
    )
  })

  it('should reject invalid types', () => {
    const schema = enum_(['hello', 'world'])

    expect(() => parse(schema, null)).toThrowError(new TypeError('Expected a string or number'))
    expect(() => parse(schema, undefined)).toThrowError(
      new TypeError('Expected a string or number'),
    )
    expect(() => parse(schema, {})).toThrowError(new TypeError('Expected a string or number'))
    expect(() => parse(schema, [])).toThrowError(new TypeError('Expected a string or number'))
  })

  it('should support custom error messages', () => {
    const schema1 = enum_([], {
      error: 'The enum is empty, no value can be parsed',
    })
    const schema2 = enum_(['hello', 'world'], {
      type_error: 'Expected a valid value',
      error: (val) => `Value "${val}" does not exist in enum`,
    })

    expect(() => parse(schema1, 'hello')).toThrowError(
      new ValidationError('The enum is empty, no value can be parsed'),
    )
    expect(() => parse(schema2, null)).toThrowError(new TypeError('Expected a valid value'))
    expect(() => parse(schema2, 'invalid')).toThrowError(
      new ValidationError('Value "invalid" does not exist in enum'),
    )
  })

  it('should handle empty arrays gracefully', () => {
    const schema = enum_([])

    expect(() => parse(schema, 'anything')).toThrowError(
      new ValidationError('Value is not a valid enum option'),
    )
  })
})
