import type { Modifier } from '../types'

export const validateModifiers = (value: unknown, modifiers?: Modifier[]) => {
  modifiers?.forEach((arg) => arg.validate(value))
}
