import { parse } from '@/core/parse'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { enum_ } from '../enum'

describe('enum_()', () => {
  it('should work', () => {
    const schema1 = enum_(['hello', 'world'])
    const schema2 = enum_([1, 2, 420])

    expect(parse(schema1, 'hello')).toEqual('hello')
    expect(parse(schema2, 420)).toEqual(420)
  })

  it('should error', () => {
    const schema1 = enum_([], { error: 'The enum is empty, no value can be parsed' })
    const schema2 = enum_(['hello', 'world'])
    const schema3 = enum_([1, 2, 420])
    const schema4 = enum_(['hello', 'world'], {
      type_error: 'Expected a valid value',
      error: (val) => `Value "${val}" does not exist in enum`,
    })

    expect(() => parse(schema1, 'hello')).toThrowError(
      new TypeError('The enum is empty, no value can be parsed'),
    )
    expect(() => parse(schema2, 'fart')).toThrowError(new ValidationError('Expected a valid value'))
    expect(() => parse(schema3, 69)).toThrowError(new ValidationError('Expected a valid value'))
    expect(() => parse(schema4, 69)).toThrowError(
      new ValidationError('Value "69" does not exist in enum'),
    )
  })
})
