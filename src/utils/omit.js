/* @flow */

/**
 * @private
 */
export default function omit<T: Object>(src: T, ...omitted: Array<string>): T {
  return Object
    .entries(src)
    .filter(([key]) => omitted.indexOf(key) < 0)
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value,
    }), {})
}
