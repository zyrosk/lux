export default function pick(obj, ...keys) {
  const result = {};
  let i, key, value;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    value = obj[key];

    if (typeof value !== 'undefined') {
      result[key] = value;
    }
  }

  return result;
}
