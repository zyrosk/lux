const { keys } = Object;

export default function omit(obj, ...omitted) {
  const result = {};
  let i, key, value, objKeys;

  objKeys = keys(obj);

  for (i = 0; i < objKeys.length; i++) {
    key = objKeys[i];

    if (omitted.indexOf(key) < 0) {
      value = obj[key];

      if (value !== undefined) {
        result[key] = value;
      }
    }
  }

  return result;
}
