import { string } from './string'

describe('string', () => {
  it('should parse strings correctly', () => {
    expect(string('tuna')).toEqual('tuna')
  })

  it('should throw an error if invalid value', () => {
    // @ts-expect-error
    expect(string.bind(this, 12)).toThrowError('Expected a string')
    // @ts-expect-error
    expect(string.bind(this, new Date())).toThrowError('Expected a string')
    // @ts-expect-error
    expect(string.bind(this, false)).toThrowError('Expected a string')
    // @ts-expect-error
    expect(string.bind(this, () => 'func')).toThrowError('Expected a string')
  })

  it('should throw an error if invalid value with custom message', () => {
    // @ts-expect-error
    expect(string.bind(this, 12, 'custom message')).toThrowError('custom message')
    // @ts-expect-error
    expect(string.bind(this, new Date(), 'custom message')).toThrowError('custom message')
    // @ts-expect-error
    expect(string.bind(this, false, 'custom message')).toThrowError('custom message')
    // @ts-expect-error
    expect(string.bind(this, () => 'func', 'custom message')).toThrowError('custom message')
  })
})
