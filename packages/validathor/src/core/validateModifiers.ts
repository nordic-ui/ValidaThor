import type { Modifier } from '@/types'

export const validateModifiers = <TValue>(value: TValue, modifiers?: Modifier<TValue>[]) => {
  modifiers?.forEach((modifier) => modifier.validate(value))
}
