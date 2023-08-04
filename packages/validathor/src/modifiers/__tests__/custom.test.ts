import { custom } from '../custom'

describe('custom()', () => {
  it('should work', () => {
    const modifier = custom((value) => [[typeof value === 'string', 'Expected a string']])

    expect(modifier.name).toEqual('custom')
    expect(modifier.validate('test')).toEqual('test')
    expect(() => modifier.validate(123)).toThrowError('Expected a string')
  })

  it('should work as a generic', () => {
    const modifier1 = custom<string>((value) => [[typeof value === 'string', 'Expected a string']])
    const modifier2 = custom<number>((value) => [[typeof value === 'number', 'Expected a number']])

    expect(modifier1.validate('test')).toEqual('test')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier1.validate(123)).toThrowError('Expected a string')

    expect(modifier2.validate(123)).toEqual(123)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier2.validate('test')).toThrowError('Expected a number')
  })

  it('should work with multiple assertions', () => {
    const modifier1 = custom((value) => [
      [typeof value === 'string', 'Expected a string'],
      [String(value).startsWith('Hello'), 'Expected a string starting with "Hello"'],
    ])
    const modifier2 = custom((value) => [
      [typeof value === 'string' || typeof value === 'number', 'Expected a string or a number'],
    ])

    expect(modifier1.validate('Hello world')).toEqual('Hello world')
    expect(() => modifier1.validate('invalid')).toThrowError(
      'Expected a string starting with "Hello"',
    )
    expect(() => modifier1.validate(123)).toThrowError('Expected a string')

    expect(modifier2.validate('test')).toEqual('test')
    expect(modifier2.validate(123)).toEqual(123)
    expect(() => modifier2.validate(false)).toThrowError('Expected a string or a number')
  })
})
