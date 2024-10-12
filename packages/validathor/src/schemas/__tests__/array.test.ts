import { parse } from '@/core/parse'
import { max, min } from '@/modifiers'
import { boolean, string, number, object } from '@/schemas'

import { array } from '../array'

describe('array()', () => {
  it('should be named correctly', () => {
    expect(array([]).name).toEqual('array')
  })

  it('should work', () => {
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

  it('should work with no modifiers', () => {
    const schema1 = array(string())
    const schema2 = array(number())
    const schema3 = array(boolean())

    expect(parse(schema1, ['hello', 'world'])).toEqual(['hello', 'world'])
    expect(parse(schema2, [1, 2, 3])).toEqual([1, 2, 3])
    expect(parse(schema3, [true, false])).toEqual([true, false])

    expect(parse(schema1, [])).toEqual([])
    expect(parse(schema2, [])).toEqual([])
    expect(parse(schema3, [])).toEqual([])
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

  it('should fail', () => {
    const schema = array(object({ name: string(), age: number(), isAdmin: boolean() }))

    expect(() => parse(schema, 'fail')).toThrowError(new TypeError('Value must be an array'))
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
})

describe('[FUTURE]', () => {
  it.fails('should work with mixed schemas', () => {
    const schema = array<string | number>([string(), number()])

    expect(parse(schema, ['hello', 'world', 123])).toEqual(['hello', 'world', 123])
    expect(() => parse(schema, ['foo', true, 'baz'])).toThrowError(
      new TypeError('Value must be at most 2 x long'),
    )
  })
})
