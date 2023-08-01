import type { Modifier } from '../types'

export const validateModifiers = (value: unknown, modifiers?: Modifier[]) => {
  // @ts-expect-error: `value` is not typed correctly
  modifiers?.forEach((arg) => arg.validate(value))
}
