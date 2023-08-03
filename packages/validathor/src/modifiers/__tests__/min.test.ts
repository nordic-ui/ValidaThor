import { ValidationError, TypeError } from '../../utils/errors'
import { min } from '../min'

describe('min()', () => {
  it('should work', () => {
    const modifier = min(2)

    expect(modifier.name).toEqual('min')
    expect(modifier.validate(3)).toEqual(3)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError('Expected a number')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(TypeError)
  })

  it('should work with custom error message', () => {
    const modifier = min(2, 'Invalid value')

    expect(() => modifier.validate(1)).toThrowError('Invalid value')
    expect(() => modifier.validate(1)).toThrowError(ValidationError)
  })
})
