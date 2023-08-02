import { Schema } from '../types'

export const parse = (schema: Schema, value: unknown) => {
  // @ts-expect-error: `value` is not typed correctly
  return schema.parse(value)
}
