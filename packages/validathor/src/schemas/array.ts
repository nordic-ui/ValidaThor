import type { Custom, Max, Min } from '@/modifiers'
import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type ArraySchemaModifiers = Array<Min<string> | Max<string> | Custom<string>>

export const array = <T extends Parser<unknown>>(
  schema: T,
  /** @todo implement */
  modifiers?: ArraySchemaModifiers,
  message?: {
    type_error?: string
  },
): Parser<T[]> => ({
  name: 'array' as const,
  parse: (value: unknown): T[] => {
    assert(
      Array.isArray(value),
      new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
    )

    return value.map((item) => schema.parse(item)) as T[]
  },
})
