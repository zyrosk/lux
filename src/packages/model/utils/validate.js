export default function validate(record, validations) {
  const { dirtyProperties } = record;
  let i, key, value, validation, isValid;

  for (i = 0; i < dirtyProperties.length; i++) {
    key = dirtyProperties[i];
    value = record[key];
    validation = validations[key];

    if (validation) {
      if (typeof validation === 'function') {
        isValid = validation.call(record, value);
      } else if (validation instanceof RegExp) {
        isValid = validation.test(value);
      } else {
        isValid = true;
      }

      if (!isValid) {
        throw new Error(`Validation failed for attribute: ${key}`);
      }
    }
  }
}
