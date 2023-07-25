function assert(condition: any, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

export const zodLike = {
  // TODO
  validate: (data: any) => data,
  object: (data: any) => ({
    refine: (
      condition: boolean | ((data: any) => boolean),
      params: { message: string; path: string[] }
    ) => {
      assert(
        condition === true || (typeof condition === 'function' && condition(data)),
        params.message
      )

      return
    },
  }),

  string: () => ({
    parse: (value: unknown): string => {
      assert(typeof value === 'string', 'Expected a string')

      return value
    },
  }),
  number: () => ({
    parse: (value: unknown): number => {
      assert(typeof value === 'number', 'Expected a number')

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
