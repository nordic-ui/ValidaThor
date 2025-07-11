import { parse } from '@/core/parse'
import { max } from '@/modifiers'
import { string, number, boolean } from '@/schemas'

import { tuple } from '../tuple'

describe('tuple()', () => {
  it('should be named correctly', () => {
    expect(tuple([]).name).toEqual('tuple')
  })

  it.each([
    [
      [number(), string()],
      [123, 'hello'],
    ],
    [
      [boolean(), number()],
      [true, 456],
    ],
  ])('should work', (schema, input) => {
    const tupleSchema = tuple(schema)

    expect(parse(tupleSchema, input)).toEqual(input)
  })

  it('should fail', () => {
    const schema1 = tuple([number(), string()])
    const schema2 = tuple([number([max(10)]), string()])

    expect(() => parse(schema1, ['hello', true])).toThrowError(new TypeError('Expected a number'))
    expect(() => parse(schema2, [69, 'hello'])).toThrowError(
      new TypeError('Value must be at most 10 or less'),
    )
  })

  it('should have correct return type', () => {
    const schema = tuple([number(), string()])

    expectTypeOf(schema.parse).returns.toEqualTypeOf<[number, string]>()
  })
})
