export const envTool = {
  parseNumber(val: any): number {
    if (typeof val === 'number') return val
    if (!isNaN(val)) return +val
    return val
  },
  parseBoolean(val: any): boolean {
    if (typeof val === 'boolean') return val
    if (!isNaN(val)) return !!+val
    return !!val
  },
  parseString(val: any): string {
    if (!val) return ''
    return String(val)
  },
  requireEnv(val: any, message: string, level: 'error' | 'warning' = 'error') {
    if (!val && level === 'error') {
      throw new Error(message)
    } else if (!val && level === 'warning') {
      console.warn(message)
    }
  },
}
