import { parse } from '../core/parse'
import type { Schema } from '../types'
import { assert, TypeError } from '../utils'

export const object = (schema: Record<string, any>, message?: string) => ({
  parse: (value: Record<string, any>) => {
    assert(typeof value === 'object', new TypeError(message || 'Expected an object'))

    Object.entries(schema).forEach(([key, schema]: [string, Schema]) => {
      parse(schema, value[key])
    })

    return value
  },
  // TODO: add `refine`? Here's an example from Zod:
  // .refine((data) => data.password === data.passwordConfirmation, {
  //   message: "Passwords don't match",
  //   path: ["passwordConfirmation"], // set the path of the error
  // })
})
