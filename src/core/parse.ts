import { Schema } from '../types'

export const parse = (schema: Schema, value: any) => {
  // @ts-expect-error
  return schema.parse(value)
}
