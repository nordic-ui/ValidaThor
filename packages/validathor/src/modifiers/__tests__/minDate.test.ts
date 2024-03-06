import { ValidationError, TypeError } from '@/utils/errors'

import { minDate } from '../minDate'

describe('minDate()', () => {
  it('should work', () => {
    const modifier = minDate(new Date('2023/06/14'))

    expect(modifier.name).toEqual('minDate')
    expect(modifier.validate(new Date('2023/06/15'))).toEqual(new Date('2023/06/15'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(new TypeError('Expected a date'))
  })

  it('should work with custom error message', () => {
    const modifier1 = minDate(new Date('2023/06/14'), { error: 'Invalid date' })
    const modifier2 = minDate(new Date('2023/06/14'), { type_error: 'Not a date' })
    // @ts-expect-error: Passing wrong value on purpose
    const modifier3 = minDate('2023/06/14', { type_error: 'Not a date' })

    expect(() => modifier1.validate(new Date('2021/06/14'))).toThrowError(
      new ValidationError('Invalid date'),
    )
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier2.validate('2021/06/14')).toThrowError(new TypeError('Not a date'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier3.validate()).toThrowError(new TypeError('Not a date'))
  })
})
