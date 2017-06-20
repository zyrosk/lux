/* @flow */

import { camelize, dasherize } from 'inflection'

import underscore from './underscore'

/**
 * @private
 */
export function transformKeys<T: Object | Array<mixed>>(
  source: T,
  transformer: (key: string) => string,
  deep: boolean = false,
): T {
  const sourceType = typeof source

  if (Array.isArray(source)) {
    return source.slice(0)
  } else if (source && sourceType === 'object') {
    return Object.entries(source).reduce((prev, [key, value]) => {
      const next = prev
      const recurse =
        deep &&
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)

      next[transformer(key)] = recurse
        ? transformKeys(value, transformer, true)
        : value

      return next
    }, {})
  }

  throw new TypeError(`Expected array or object. Received ${sourceType}.`)
}

/**
 * @private
 */
export function camelizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean,
): T {
  return transformKeys(source, key => camelize(underscore(key), true), deep)
}

/**
 * @private
 */
export function dasherizeKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean,
): T {
  return transformKeys(source, key => dasherize(underscore(key), true), deep)
}

/**
 * @private
 */
export function underscoreKeys<T: Object | Array<mixed>>(
  source: T,
  deep?: boolean,
): T {
  return transformKeys(source, key => underscore(key), deep)
}
