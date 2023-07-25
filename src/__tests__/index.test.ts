import { zodLike } from '../'

describe('zodLike', () => {
  describe('parse', () => {
    it('should parse strings correctly', () => {
      expect(zodLike.string().parse('tuna')).toEqual('tuna')
      // @see https://stackoverflow.com/a/49787199
      expect(zodLike.string().parse.bind(this, 12)).toThrowError('Expected a string')
    })

    it('should parse numbers correctly', () => {
      expect(zodLike.number().parse(12)).toEqual(12)
      // @see https://stackoverflow.com/a/49787199
      expect(zodLike.number().parse.bind(this, 'cat')).toThrowError('Expected a number')
    })
  })
})
