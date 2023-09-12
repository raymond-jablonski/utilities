export const exp = Math.exp
export const ln = Math.log
export const sqrt = Math.sqrt
export const abs = Math.abs
export const min = Math.min
export const max = Math.max
export const clamp = (val, min, max) => min(max,max(min, val))
export const modulo = (val, maxVal) => maxVal === 0 ? 0 : ((val % maxVal) + maxVal) % maxVal