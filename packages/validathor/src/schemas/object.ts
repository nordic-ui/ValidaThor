import { assert, TypeError } from '../utils'

export const object = (schema: Record<string, unknown>, message?: string) => ({
  parse: (value: Record<string, unknown>) => {
    assert(
      value !== null &&
        value instanceof Object &&
        !(value instanceof Array) &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Error) &&
        !(value instanceof Function) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String),
      new TypeError(message || 'Expected an object'),
    )

    Object.entries(schema).forEach(([key, schema]) => {
      // @ts-expect-error: `schema` is not typed correctly
      schema.parse(value[key])
    })

    return value
  },
})
