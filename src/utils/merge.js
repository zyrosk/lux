/* @flow */

import isObject from './is-object'

type Merge<T: Object, U: Object> = {
  ...T,
  ...U,
}

const merge = <T: Object, U: Object>(dest: T, source: U): Merge<T, U> =>
  Object
    .entries(dest)
    .concat(Object.entries(source))
    .reduce((prev, [key, value]) => {
      const currentValue = prev[key]
      const next = prev

      if (isObject(currentValue) && isObject(value)) {
        next[key] = merge(currentValue, value)
      } else {
        next[key] = value
      }

      return next
    }, {})

export default merge
