import { email } from '../email'

describe('email()', () => {
  it('should work', () => {
    const modifier = email()

    expect(modifier.name).toEqual('email')
    expect(modifier.validate('example@example.test')).toEqual('example@example.test')
    expect(() => modifier.validate('foo')).toThrowError('Expected an email')
  })

  it('should work with domain arg', () => {
    const modifier = email('@example.test')

    expect(modifier.name).toEqual('email')
    expect(modifier.validate('example@example.test')).toEqual('example@example.test')
    expect(() => modifier.validate('invalid@invalid.com')).toThrowError(
      'Expected an email ending with @example.test',
    )
  })

  it('should work with custom error message', () => {
    const modifier = email(undefined, 'Invalid email value')

    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate(123)).toThrowError('Invalid email value')
  })
})
