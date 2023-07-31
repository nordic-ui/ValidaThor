import type { Modifier } from '../types'

export const validateModifiers = (value: any, modifiers?: Modifier[]) => {
  // @ts-expect-error
  modifiers?.forEach((arg) => arg.validate(value))
}
