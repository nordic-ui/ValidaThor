import { zodLike } from '../'

describe('zodLike', () => {
  describe('string', () => {
    it('should parse strings correctly', () => {
      expect(zodLike.string().parse('tuna')).toEqual('tuna')
    })

    // @see https://stackoverflow.com/a/49787199
    it('should throw an error if invalid value', () => {
      const myStr = zodLike.string()

      // @ts-expect-error
      expect(myStr.parse.bind(this, 12)).toThrowError('Expected a string')
      // @ts-expect-error
      expect(myStr.parse.bind(this, new Date())).toThrowError('Expected a string')
      // @ts-expect-error
      expect(myStr.parse.bind(this, false)).toThrowError('Expected a string')
      // @ts-expect-error
      expect(myStr.parse.bind(this, () => 'func')).toThrowError('Expected a string')
    })
  })

  describe('number', () => {
    it('should parse numbers correctly', () => {
      expect(zodLike.number().parse(12)).toEqual(12)
    })

    // @see https://stackoverflow.com/a/49787199
    it('should throw an error if invalid value', () => {
      const myNum = zodLike.number()

      // Not finite numbers
      expect(myNum.parse.bind(this, 1e999)).toThrowError('Expected a finite number')
      expect(myNum.parse.bind(this, Infinity)).toThrowError('Expected a finite number')
      // Not numbers at all
      // @ts-expect-error
      expect(myNum.parse.bind(this, undefined)).toThrowError('Expected a number')
      // @ts-expect-error
      expect(myNum.parse.bind(this, null)).toThrowError('Expected a number')
      // @ts-expect-error
      expect(myNum.parse.bind(this, 'cat')).toThrowError('Expected a number')
      // @ts-expect-error
      expect(myNum.parse.bind(this, new Date())).toThrowError('Expected a number')
      // @ts-expect-error
      expect(myNum.parse.bind(this, false)).toThrowError('Expected a number')
      // @ts-expect-error
      expect(myNum.parse.bind(this, () => 'func')).toThrowError('Expected a number')
    })

    it('should parse numbers with min correctly', () => {
      const myNum = zodLike.number()

      expect(myNum.min(12).parse(12)).toEqual(12)
      expect(myNum.min(12).parse(13)).toEqual(13)
      expect(myNum.min(12).parse.bind(this, 11)).toThrowError(
        'Expected a number greater than or equal to 12'
      )
    })

    it('should parse numbers with max correctly', () => {
      expect(zodLike.number().max(12).parse(12)).toEqual(12)
      expect(zodLike.number().max(12).parse(11)).toEqual(11)
      expect(zodLike.number().max(12).parse.bind(this, 13)).toThrowError(
        'Expected a number less than or equal to 12'
      )
    })

    it('should parse numbers with min and max correctly', () => {
      expect(zodLike.number().min(12).max(14).parse(12)).toEqual(12)
      expect(zodLike.number().max(14).min(12).parse(12)).toEqual(12)
    })
  })

  describe('validate', () => {
    it('should validate', () => {
      expect(zodLike.validate('tuna')).toEqual('tuna')
      expect(zodLike.validate(2)).toEqual(2)
      expect(zodLike.validate({ key: 'value' })).toEqual({ key: 'value' })
    })
  })

  describe('object', () => {
    it('should refine', () => {
      const obj = { hello: 'world', key: 'value' }
      const myObj = zodLike.object<typeof obj>(obj)

      expect(myObj.refine(() => true, { message: 'oh no', path: ['test'] })).toEqual({
        hello: 'world',
        key: 'value',
      })

      expect(
        myObj.refine((data) => data.hello === 'world', { message: 'oh no', path: ['test'] })
      ).toEqual({ hello: 'world', key: 'value' })

      expect(
        myObj.refine.bind(this, (data) => data.hello !== 'world', {
          message: 'oh no',
          path: ['test'],
        })
      ).toThrowError('oh no')
    })
  })
})
