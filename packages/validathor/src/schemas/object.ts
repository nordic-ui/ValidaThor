import { parse } from '../core/parse'
import type { Schema } from '../types'
import { assert, TypeError } from '../utils'

export const object = (schema: Record<string, unknown>, message?: string) => ({
  parse: (value: Record<string, unknown>) => {
    assert(typeof value === 'object', new TypeError(message || 'Expected an object'))

    Object.entries(schema).forEach(([key, schema]) => {
      parse(schema as Schema, value[key])
    })

    return value
  },
  // TODO: add `refine`? Here's an example from Zod:
  // .refine((data) => data.password === data.passwordConfirmation, {
  //   message: "Passwords don't match",
  //   path: ["passwordConfirmation"], // set the path of the error
  // })
})
