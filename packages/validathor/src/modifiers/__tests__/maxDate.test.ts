import { ValidationError, TypeError } from '../../utils/errors'
import { maxDate } from '../maxDate'

describe('maxDate()', () => {
  it('should work', () => {
    const modifier = maxDate(new Date('2023/06/14'))

    expect(modifier.name).toEqual('maxDate')
    expect(modifier.validate(new Date('2023/06/10'))).toEqual(new Date('2023/06/10'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError('Expected a date')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(TypeError)
  })

  it('should work with custom error message', () => {
    const modifier = maxDate(new Date('2023/06/14'), 'Invalid value')

    expect(() => modifier.validate(new Date('2024/06/14'))).toThrowError('Invalid value')
    expect(() => modifier.validate(new Date('2024/06/14'))).toThrowError(ValidationError)
  })
})
