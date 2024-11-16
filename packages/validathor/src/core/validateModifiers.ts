import type { Modifier } from '@/types'

export const validateModifiers = <T>(value: T, modifiers?: Modifier<T>[]) => {
  modifiers?.forEach((modifier) => modifier.validate(value))
}
