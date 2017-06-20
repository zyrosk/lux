/* @flow */

// $FlowFixMe
type Merge<T, U> = { ...T, ...U }

const merge = <T, U>(dest: T, source: U): Merge<T, U> =>
  Object.entries(dest)
    .concat(Object.entries(source))
    .reduce((prev, [key, value]) => {
      const currentValue = prev[key]
      const next = prev

      if (
        currentValue &&
        typeof currentValue === 'object' &&
        !Array.isArray(currentValue) &&
        value &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        next[key] = merge(currentValue, value)
      } else {
        next[key] = value
      }

      return next
    }, {})

export default merge
