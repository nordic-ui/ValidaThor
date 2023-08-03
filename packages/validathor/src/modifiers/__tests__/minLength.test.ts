import { ValidationError, TypeError } from '../../utils/errors'
import { minLength } from '../minLength'

describe('minLength()', () => {
  it('should work', () => {
    const modifier1 = minLength(2)
    // @ts-expect-error: Passing wrong value on purpose
    const modifier2 = minLength('invalid')

    expect(modifier1.name).toEqual('minLength')
    expect(modifier1.validate('foo')).toEqual('foo')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier1.validate(123)).toThrowError('Expected a string')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier1.validate(123)).toThrowError(TypeError)
    expect(() => modifier2.validate('invalid')).toThrowError('Expected a number')
  })

  it('should work with custom error message', () => {
    const modifier = minLength(4, 'Invalid value')

    expect(() => modifier.validate('foo')).toThrowError('Invalid value')
    expect(() => modifier.validate('foo')).toThrowError(ValidationError)
  })
})
