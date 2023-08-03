import { ValidationError, TypeError } from '../../utils/errors'
import { max } from '../max'

describe('max()', () => {
  it('should work', () => {
    const modifier = max(4)

    expect(modifier.name).toEqual('max')
    expect(modifier.validate(3)).toEqual(3)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError('Expected a number')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(TypeError)
  })

  it('should work with custom error message', () => {
    const modifier = max(4, 'Invalid value')

    expect(() => modifier.validate(9)).toThrowError('Invalid value')
    expect(() => modifier.validate(9)).toThrowError(ValidationError)
  })
})
