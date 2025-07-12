import { parse } from '@/core/parse'
import { max, min } from '@/modifiers'
import { boolean, string, number, object, date, union, literal } from '@/schemas'
import { ValidationError } from '@/utils'

import { array } from '../array'

describe('array()', () => {
  it('should be named correctly', () => {
    expect(array([]).name).toEqual('array')
  })

  it('should work with objects', () => {
    const schema = array(object({ name: string(), age: number(), isAdmin: boolean() }))

    expect(
      parse(schema, [
        { name: 'John Doe', age: 34, isAdmin: true },
        { name: 'Obi-Wan Kenobi', age: 38, isAdmin: true },
      ]),
    ).toEqual([
      { name: 'John Doe', age: 34, isAdmin: true },
      { name: 'Obi-Wan Kenobi', age: 38, isAdmin: true },
    ])
  })

  it('should work with nested arrays', () => {
    const schema = array(array(string()))

    expect(
      parse(schema, [
        ['hello', 'world'],
        ['foo', 'bar'],
      ]),
    ).toEqual([
      ['hello', 'world'],
      ['foo', 'bar'],
    ])
    expect(() =>
      parse(schema, [
        ['hello', 'world'],
        ['foo', 123],
      ]),
    ).toThrowError(new TypeError('Expected a string'))
  })

  it('should work with mixed schemas', () => {
    const schema = array([string(), number(), boolean()])

    expect(parse(schema, ['hello', 123, true])).toEqual(['hello', 123, true])

    expect(() => parse(schema, ['foo', new Date(), 123])).toThrowError(
      new TypeError('Expected a boolean'),
    )
  })

  it('should work with no modifiers', () => {
    const schema1 = array(string())
    const schema2 = array(number())
    const schema3 = array(boolean())
    const schema4 = array(date())
    const schema5 = array(literal('hello'))
    const schema6 = array(object({ name: string() }))
    const schema7 = array(array([number()]))

    expect(parse(schema1, ['hello', 'world'])).toEqual(['hello', 'world'])
    expect(parse(schema2, [1, 2, 3])).toEqual([1, 2, 3])
    expect(parse(schema3, [true, false])).toEqual([true, false])
    expect(
      parse(schema4, [new Date('2018-03-06T09:00:00.000Z'), new Date('2024-11-16T17:07:39.128Z')]),
    ).toEqual([new Date('2018-03-06T09:00:00.000Z'), new Date('2024-11-16T17:07:39.128Z')])
    expect(parse(schema5, ['hello'])).toEqual(['hello'])
    expect(parse(schema6, [{ name: 'Obi-Wan Kenobi' }, { name: 'Anakin Skywalker' }])).toEqual([
      { name: 'Obi-Wan Kenobi' },
      { name: 'Anakin Skywalker' },
    ])
    expect(
      parse(schema7, [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
    ).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ])

    expect(parse(schema1, [])).toEqual([])
    expect(parse(schema2, [])).toEqual([])
    expect(parse(schema3, [])).toEqual([])
    expect(parse(schema4, [])).toEqual([])
    expect(parse(schema5, [])).toEqual([])
    expect(parse(schema6, [])).toEqual([])
    expect(parse(schema7, [])).toEqual([])
  })

  it('should work with modifiers', () => {
    const schema1 = array(string(), [max(2)])
    const schema2 = array(number(), [min(3)])
    const schema3 = array(number([max(69)]), [min(3)])
    const schema4 = array(number([max(69)]), [max(-2)])

    expect(parse(schema1, ['hello', 'world'])).toEqual(['hello', 'world'])
    expect(parse(schema2, [1, 2, 3])).toEqual([1, 2, 3])

    expect(() => parse(schema1, ['foo', 'bar', 'baz'])).toThrowError(
      new TypeError('Value must be at most 2 x long'),
    )
    expect(() => parse(schema2, [1, 2])).toThrowError(
      new TypeError('Value must be at least 3 x long'),
    )
    expect(() => parse(schema3, [1, 2, 420])).toThrowError(
      new TypeError('Value must be at most 69 or less'),
    )
    expect(() => parse(schema3, [42, 1024])).toThrowError(
      new TypeError('Value must be at least 3 x long'),
    )
    expect(() => parse(schema3, [42, 1024, Infinity])).toThrowError(
      new TypeError('Value must be at most 69 or less'),
    )
    expect(() => parse(schema3, [Infinity, NaN, NaN])).toThrowError(
      new TypeError('Expected a finite number'),
    )
    expect(() => parse(schema4, [42, 1024, Infinity])).toThrowError(
      new TypeError('Maximum length must be a positive number'),
    )
  })

  it('should work with literals', () => {
    const schema1 = array(literal(123))
    const schema2 = array(union([literal(123), literal(456)]))

    expect(parse(schema1, [123])).toEqual([123])
    expect(parse(schema1, [123, 123])).toEqual([123, 123])

    expect(parse(schema2, [123])).toEqual([123])
    expect(parse(schema2, [123, 456])).toEqual([123, 456])

    expect(() => parse(schema1, [456])).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
    expect(() => parse(schema2, [654, 321])).toThrowError(
      new ValidationError('Expected value to match one of: literal | literal'),
    )
  })

  it('should work with unions', () => {
    const schema = array(
      union([
        object({
          type: string(),
          value: string(),
          literal: literal(69),
          deep: union([object({ msg: string() }), string()]),
        }),
        object({ type: string(), count: number(), literal: literal(42) }),
      ]),
    )

    const validData = [
      { type: 'value', value: 'hello', literal: 69, deep: { msg: 'test' } },
      { type: 'count', count: 100, literal: 42 },
      { type: 'value', value: 'world', literal: 69, deep: 'test' },
      { type: 'count', count: 200, literal: 42 },
    ]

    expect(parse(schema, validData)).toEqual(validData)

    // Test with empty array
    expect(parse(schema, [])).toEqual([])

    // Test with single element matching first union variant
    expect(parse(schema, [{ type: 'value', value: 'test', literal: 69, deep: 'test' }])).toEqual([
      { type: 'value', value: 'test', literal: 69, deep: 'test' },
    ])

    // Test with single element matching second union variant
    expect(parse(schema, [{ type: 'count', count: 50, literal: 42 }])).toEqual([
      { type: 'count', count: 50, literal: 42 },
    ])

    // Test failures - wrong literal value
    expect(() =>
      parse(schema, [{ type: 'value', value: 'fail', literal: 42, deep: 'test' }]),
    ).toThrowError()
    expect(() => parse(schema, [{ type: 'count', count: 50, literal: 69 }])).toThrowError()

    // Test failures - missing fields
    expect(() => parse(schema, [{ type: 'value', literal: 69 }])).toThrowError()
    expect(() => parse(schema, [{ type: 'count', literal: 42 }])).toThrowError()

    // Test failures - wrong types
    expect(() =>
      parse(schema, [{ type: 'value', value: 123, literal: 69, deep: 'test' }]),
    ).toThrowError()
    expect(() => parse(schema, [{ type: 'count', count: 'string', literal: 42 }])).toThrowError()

    // Test mixed valid and invalid elements
    expect(() =>
      parse(schema, [
        { type: 'value', value: 'valid', literal: 69, deep: 'test' },
        { type: 'invalid', literal: 100 },
      ]),
    ).toThrowError()
  })

  it('should fail on nested schema validations', () => {
    const schema = array(object({ name: string(), age: number(), isAdmin: boolean() }))

    expect(() => parse(schema, 'fail')).toThrowError(new TypeError('Expected an array'))
    expect(() => parse(schema, ['fail'])).toThrowError(new TypeError('Expected an object'))
    expect(() => parse(schema, [{ name: 123 }])).toThrowError(new TypeError('Expected a string'))
    expect(() => parse(schema, [{ name: 'John Doe', age: 'foo' }])).toThrowError(
      new TypeError('Expected a number'),
    )
    expect(() =>
      parse(schema, [
        { name: 'John Doe', age: 34, isAdmin: true },
        { name: 'Obi-Wan Kenobi', age: 38, isAdmin: 'false' },
      ]),
    ).toThrowError(new TypeError('Expected a boolean'))
  })

  it('should have correct return type', () => {
    const schema1 = array([string()])
    const schema2 = array([number()])
    const schema3 = array([number(), string()])

    expectTypeOf(schema1.parse).returns.toEqualTypeOf<string[]>()
    expectTypeOf(schema2.parse).returns.toEqualTypeOf<number[]>()
    expectTypeOf(schema3.parse).returns.toEqualTypeOf<(number | string)[]>()
  })
})
