import { parse } from '@/core/parse'
import { boolean, string, number, object } from '@/schemas'

import { array } from '../array'

describe('array()', () => {
  it('should be named correctly', () => {
    // @ts-expect-error - We are just testing the name here, so the schema can be empty
    expect(array().name).toEqual('array')
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

  // TODO: modifiers are not yet implemented
  it.skip('should work with modifiers', () => {
    const schema1 = array(string(), [])
    const schema2 = array(number(), [])
    const schema3 = array(boolean(), [])

    expect(parse(schema1, ['hello', 'world'])).toEqual(['hello', 'world'])
    expect(parse(schema2, [1, 2, 3])).toEqual([1, 2, 3])
    expect(parse(schema3, [true, false])).toEqual([true, false])

    expect(() => parse(schema1, [])).toThrowError()
    expect(() => parse(schema2, [])).toThrowError()
    expect(() => parse(schema3, [])).toThrowError()
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

  it('should fail', () => {
    const schema1 = array(object({ name: string() }))
    const schema2 = array(object({ age: number() }))

    expect(() => parse(schema1, 'fail')).toThrowError(new TypeError('Value must be an array'))
    expect(() => parse(schema1, [{ foo: 123 }])).toThrowError(new TypeError('Expected a string'))
    expect(() => parse(schema2, [{ foo: 'foo' }])).toThrowError(new TypeError('Expected a number'))
  })

  it('should also fail', () => {
    const schema = array(object({ name: string(), age: number(), isAdmin: boolean() }))

    expect(() =>
      parse(schema, [
        { name: 'John Doe', age: 34, isAdmin: true },
        { name: 'Obi-Wan Kenobi', age: 38, isAdmin: 'false' },
      ]),
    ).toThrowError(new TypeError('Expected a boolean'))
  })
})
