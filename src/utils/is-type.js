/* @flow */

export const isUndefined = (value: mixed): boolean %checks =>
  value === undefined

export const isNull = (value: mixed): boolean %checks => value === null

export const isNil = (value: mixed): boolean %checks =>
  isUndefined(value) || isNull(value)

/**
 * Determine wether or not a value is an Object.
 *
 * @example
 * const a = null
 * const b = []
 * const c = {}
 *
 * console.log(typeof a, typeof b, typeof c)
 * // => 'object', 'object', 'object' 👎
 *
 * console.log(isObject(a), isObject(b), isObject(c))
 * // => false, false, true 👍
 */ export const isObject = (
  value: mixed,
): boolean %checks =>
  !isNull(value) && typeof value === 'object' && !Array.isArray(value)
export const isString = (value: mixed): boolean %checks =>
  typeof value === 'string'
