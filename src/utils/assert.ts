export function assert(condition: any, message: string): asserts condition {
  const _condition = typeof condition === 'function' ? condition() : condition
  if (!_condition) throw new Error(message)
}
