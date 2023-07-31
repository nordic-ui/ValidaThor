import { Schema } from '../types'

export const parse = (schema: Schema, value: any) => {
  // @ts-ignore
  return schema.parse(value)
}
