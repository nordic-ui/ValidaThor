import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, MaxDate, MinDate } from '@/modifiers'
import { assert, TypeError } from '@/utils'

export type DateSchemaArgs = Array<MinDate | MaxDate | Custom<Date>>

export const date = (args?: DateSchemaArgs, message?: { type_error?: string }) => ({
  parse: (value: Date) => {
    assert(value instanceof Date, new TypeError(message?.type_error || 'Expected a Date'))

    validateModifiers(value, args)

    return value
  },
})
