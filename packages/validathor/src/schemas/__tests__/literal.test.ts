import { parse } from '@/core/parse'
import { ValidationError } from '@/utils/errors/errors'

import { literal } from '../literal'

describe('literal()', () => {
  it('should be named correctly', () => {
    expect(literal('test').name).toEqual('literal')
  })

  it('should work with string literals', () => {
    const schema = literal('hello')

    expect(parse(schema, 'hello')).toEqual('hello')
    expect(schema.parse('hello')).toEqual('hello')
    expect(() => parse(schema, 'world')).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema, '')).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema, 123)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should work with number literals', () => {
    const schema = literal(42)

    expect(parse(schema, 42)).toEqual(42)
    expect(schema.parse(42)).toEqual(42)
    expect(() => parse(schema, 41)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema, '42')).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should work with boolean literals', () => {
    const schemaTrue = literal(true)
    const schemaFalse = literal(false)

    expect(parse(schemaTrue, true)).toEqual(true)
    expect(parse(schemaFalse, false)).toEqual(false)
    expect(() => parse(schemaTrue, false)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schemaFalse, true)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should work with null literal', () => {
    const schema = literal(null)

    expect(parse(schema, null)).toEqual(null)
    expect(() => parse(schema, undefined)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema, 0)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should work with undefined literal', () => {
    const schema = literal(undefined)

    expect(parse(schema, undefined)).toEqual(undefined)
    expect(() => parse(schema, null)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema, '')).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should work with custom error message', () => {
    const schema = literal('expected', { error: 'Must be exactly "expected"' })

    expect(() => parse(schema, 'unexpected')).toThrowError(
      new ValidationError('Must be exactly "expected"'),
    )
  })

  it('should work with custom error function', () => {
    const schema = literal(42, {
      error: (value) => `Expected 42 but got ${value}`,
    })

    expect(() => parse(schema, 43)).toThrowError(new ValidationError('Expected 42 but got 43'))
  })

  it('should preserve literal type in TypeScript', () => {
    const schema = literal('hello' as const)
    type SchemaType = ReturnType<typeof schema.parse>

    const result: SchemaType = 'hello'
    expect(result).toEqual('hello')
  })

  it('should handle edge cases', () => {
    const schemaEmptyString = literal('')
    const schemaZero = literal(0)
    const schemaNegative = literal(-1)

    expect(parse(schemaEmptyString, '')).toEqual('')
    expect(parse(schemaZero, 0)).toEqual(0)
    expect(parse(schemaNegative, -1)).toEqual(-1)

    expect(() => parse(schemaZero, false)).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })
})
