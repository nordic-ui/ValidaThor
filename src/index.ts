function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export const zodLike = {
  // TODO
  validate: <T>(data: T) => data,
  object: <T>(data: T) => ({
    refine: (
      condition: boolean | ((data: T) => boolean),
      params: { message: string; path: string[] }
    ) => {
      assert(
        condition === true || (typeof condition === 'function' && condition(data)),
        params.message
      )

      return data
    },
  }),

  string: () => ({
    parse: (value: string) => {
      assert(typeof value === 'string', 'Expected a string')

      return value
    },
  }),

  number: () => ({
    min: (min: number) => ({
      parse: (value: number) => {
        assert(typeof value === 'number', 'Expected a number')
        assert(isFinite(value), 'Expected a finite number')
        assert(value >= min, `Expected a number greater than or equal to ${min}`)

        return value
      },

      max: (max: number) => zodLike.number().max(max),
    }),

    max: (max: number) => ({
      parse: (value: number) => {
        assert(typeof value === 'number', 'Expected a number')
        assert(isFinite(value), 'Expected a finite number')
        assert(value <= max, `Expected a number less than or equal to ${max}`)

        return value
      },

      min: (min: number) => zodLike.number().min(min),
    }),

    parse: (value: number) => {
      assert(typeof value === 'number', 'Expected a number')
      assert(isFinite(value), 'Expected a finite number')

      return value
    },
  }),
}

// zodLike.validate({
//   hello: 'world',
// })

// Fails
// zodLike.object({ hello: 'world' }).refine(() => false, { message: 'oh no', path: ['butt'] });
// zodLike.object({ hello: 'world' }).refine((data) => data?.hello !== 'world', { message: 'fart', path: ['butt'] });

// Passes
// zodLike.object({ hello: 'world' }).refine(() => true, { message: 'fart', path: ['balls'] })
// zodLike
//   .object({ hello: 'world' })
//   .refine((data) => data.hello === 'world', { message: 'fart', path: ['butt'] })
