export const max = (max: number, message?: string) => {
  const errorMessage = message || 'Maximum value exceeded'

  return {
    name: 'max' as const,
    args: { max, message: errorMessage },
  }
}
