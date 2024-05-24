import type { Modifier } from '@/types'

export const validateModifiers = <T>(value: T, modifiers?: Modifier<T>[]) => {
  // 🤷‍♂️ Idk why but I need to cast value to never to make it work
  // `error occured in dts build`
  modifiers?.forEach((arg) => arg.validate(value))
}
