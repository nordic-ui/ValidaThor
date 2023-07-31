export const min = (min: number, message?: string) => {
  const errorMessage = message || 'Minimum value not met'

  return {
    name: 'min' as const,
    args: { min, message: errorMessage },
  }
}
