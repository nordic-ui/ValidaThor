import { parse } from '@/core/parse'
import { string, number, boolean, date, literal, array, object } from '@/schemas'

import { union } from '../union'

describe('union()', () => {
  it('should be named correctly', () => {
    expect(union([string()]).name).toEqual('union')
  })

  it('should work with string or number', () => {
    const schema = union([string(), number()])

    expect(parse(schema, 'hello')).toEqual('hello')
    expect(parse(schema, 420)).toEqual(420)
    expect(schema.parse('world')).toEqual('world')
    expect(schema.parse(123)).toEqual(123)

    expect(() => parse(schema, true)).toThrowError(
      'Expected value to match one of: string | number',
    )
    expect(() => parse(schema, {})).toThrowError('Expected value to match one of: string | number')
    expect(() => parse(schema, [])).toThrowError('Expected value to match one of: string | number')
    expect(() => schema.parse(false)).toThrowError(
      'Expected value to match one of: string | number',
    )
  })

  it('should work with multiple types', () => {
    const schema = union([string(), number(), boolean()])

    expect(parse(schema, 'test')).toEqual('test')
    expect(parse(schema, 999)).toEqual(999)
    expect(parse(schema, true)).toEqual(true)
    expect(parse(schema, false)).toEqual(false)
    expect(schema.parse('foo')).toEqual('foo')
    expect(schema.parse(0)).toEqual(0)
    expect(schema.parse(true)).toEqual(true)

    expect(() => parse(schema, {})).toThrowError(
      'Expected value to match one of: string | number | boolean',
    )
    expect(() => parse(schema, [])).toThrowError(
      'Expected value to match one of: string | number | boolean',
    )
    expect(() => parse(schema, new Date())).toThrowError(
      'Expected value to match one of: string | number | boolean',
    )
  })

  it('should work with custom error message', () => {
    const schema = union([string(), number()], { type_error: 'Must be string or number' })

    expect(() => parse(schema, true)).toThrowError('Must be string or number')
    expect(() => schema.parse({})).toThrowError('Must be string or number')
  })

  it('should handle null and undefined', () => {
    const schema = union([string(), number()])

    expect(() => parse(schema, null)).toThrowError("Value can't be null or undefined")
    expect(() => parse(schema, undefined)).toThrowError("Value can't be null or undefined")
    expect(() => schema.parse(null)).toThrowError("Value can't be null or undefined")
    expect(() => schema.parse(undefined)).toThrowError("Value can't be null or undefined")
  })

  it('should work with complex schemas', () => {
    const schema = union([
      object({ type: string(), value: string(), literal: literal(69) }),
      object({ type: string(), count: number(), literal: literal(420) }),
      array(number()),
    ])

    expect(parse(schema, { type: 'text', value: 'hello', literal: 69 })).toEqual({
      type: 'text',
      value: 'hello',
      literal: 69,
    })
    expect(parse(schema, { type: 'counter', count: 420, literal: 420 })).toEqual({
      type: 'counter',
      count: 420,
      literal: 420,
    })
    expect(parse(schema, [1, 2, 3])).toEqual([1, 2, 3])

    expect(schema.parse({ type: 'text', value: 'world', literal: 69 })).toEqual({
      type: 'text',
      value: 'world',
      literal: 69,
    })
    expect(schema.parse({ type: 'counter', count: 0, literal: 420 })).toEqual({
      type: 'counter',
      count: 0,
      literal: 420,
    })
    expect(schema.parse([4, 5, 6])).toEqual([4, 5, 6])

    expect(() => parse(schema, 'invalid')).toThrowError(
      'Expected value to match one of: object | object | array',
    )
    expect(() => parse(schema, 123)).toThrowError(
      'Expected value to match one of: object | object | array',
    )
    expect(() => parse(schema, true)).toThrowError(
      'Expected value to match one of: object | object | array',
    )
  })

  it('should return the first matching schema result', () => {
    const schema = union([object({ a: string() }), object({ b: string() })])

    // This should match the first schema since it has property 'a'
    expect(parse(schema, { a: 'test' })).toEqual({ a: 'test' })

    // This should match the second schema since it has property 'b'
    expect(parse(schema, { b: 'test' })).toEqual({ b: 'test' })
  })

  it('should throw error when no schemas are provided', () => {
    expect(() => union([])).toThrowError('Union schema requires at least one schema')
  })

  it('should work with date schemas', () => {
    const schema = union([string(), date()])
    const testDate = new Date('2024-01-01')

    expect(parse(schema, 'test')).toEqual('test')
    expect(parse(schema, testDate)).toEqual(testDate)
    expect(schema.parse('hello')).toEqual('hello')
    expect(schema.parse(testDate)).toEqual(testDate)

    expect(() => parse(schema, 123)).toThrowError('Expected value to match one of: string | date')
    expect(() => schema.parse(true)).toThrowError('Expected value to match one of: string | date')
  })
})
