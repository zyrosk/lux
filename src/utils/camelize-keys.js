import { camelize } from 'inflection';

const { keys } = Object;
const { isArray } = Array;

export default function camelizeKeys(obj, deep = false) {
  const result = {};
  let i, key, value, objKeys;

  if (isArray(obj)) {
    return obj.slice();
  } else {
    objKeys = keys(obj);

    for (i = 0; i < objKeys.length; i++) {
      key = objKeys[i];
      value = obj[key];

      if (value && typeof value === 'object' && !isArray(obj) && deep) {
        value = camelizeKeys(value, true);
      }

      result[camelize(key.replace(/-/g, '_'), true)] = value;
    }
  }

  return result;
}
