import { Schema } from '@/types'

export const parse = <T>(schema: Schema<T>, value: unknown) => {
  // @ts-expect-error: `value` is not typed correctly
  return schema.parse(value)
}
