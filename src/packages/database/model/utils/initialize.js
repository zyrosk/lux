import { camelize, dasherize, singularize } from 'inflection';

import { line } from '../../../logger';
import entries from '../../../../utils/entries';
import underscore from '../../../../utils/underscore';

const REFS = new WeakMap();

const VALID_HOOKS = [
  'afterCreate',
  'afterDestroy',
  'afterSave',
  'afterUpdate',
  'afterValidation',
  'beforeCreate',
  'beforeDestroy',
  'beforeSave',
  'beforeUpdate',
  'beforeValidation'
];

function refsFor(instance) {
  let table = REFS.get(instance);

  if (!table) {
    table = Object.create(null);
    REFS.set(instance, table);
  }

  return table;
}

function initializeProps(prototype, attributes, relationships) {
  const props = Object.create(null);

  entries(attributes)
    .reduce((hash, [key, { type, nullable, defaultValue }]) => {
      if (/^(boolean|tinyint)$/.test(type)) {
        defaultValue = Boolean(
          typeof defaultValue === 'string' ?
            parseInt(defaultValue, 10) : defaultValue
        );
      } else if (type === 'datetime' && typeof defaultValue === 'number') {
        defaultValue = new Date(defaultValue);
      }

      hash[key] = {
        get() {
          const refs = refsFor(this);

          return refs[key] || defaultValue;
        },

        set(nextValue) {
          const refs = refsFor(this);
          const currentValue = refs[key] || defaultValue;

          if (nextValue !== currentValue) {
            const { initialized, initialValues } = this;

            if (/^(boolean|tinyint)$/.test(type)) {
              nextValue = Boolean(
                typeof nextValue === 'string' ?
                  parseInt(nextValue, 10) : nextValue
              );
            } else if (type === 'datetime' && typeof nextValue === 'number') {
              nextValue = new Date(nextValue);
            } else if (!nextValue && !nullable) {
              return;
            }

            refs[key] = nextValue;

            if (initialized) {
              const { dirtyAttributes } = this;
              const initialValue = initialValues.get(key) || defaultValue;

              if (nextValue !== initialValue) {
                dirtyAttributes.add(key);
              } else {
                dirtyAttributes.delete(key);
              }
            } else {
              initialValues.set(key, nextValue);
            }
          }
        }
      };

      return hash;
    }, props);

  entries(relationships)
    .reduce((hash, [key, { type, model }]) => {
      if (type === 'hasMany') {
        hash[key] = {
          get() {
            const refs = refsFor(this);

            return refs[key] || [];
          },

          set(value) {
            const refs = refsFor(this);

            if (Array.isArray(value)) {
              refs[key] = value;
            }
          }
        };
      } else {
        hash[key] = {
          get() {
            return refsFor(this)[key] || null;
          },

          set(record) {
            refsFor(this)[key] = record ? new model(record) : undefined;
          }
        };
      }

      return hash;
    }, props);

  Object.defineProperties(prototype, props);
}

function initializeHooks(model, hooks) {
  hooks = entries({ ...hooks })
    .filter(([key]) => {
      const isValid = VALID_HOOKS.indexOf(key) >= 0;

      if (!isValid) {
        model.logger.warn(line`
          Invalid hook '${key}' will not be added to Model '${model.name}'.
          Valid hooks are ${VALID_HOOKS.map(h => `'${h}'`).join(', ')}.
        `);
      }

      return isValid;
    })
    .reduce((hash, [key, hook]) => {
      return {
        ...hash,
        [key]: async (...args) => await hook.apply(model, args)
      };
    }, Object.create(null));

  return Object.freeze(hooks);
}

function initializeValidations(model, attributes, validations) {
  const attributeNames = Object.keys(attributes);

  const validates = entries(validations)
    .filter(([key, value]) => {
      let isValid = attributeNames.indexOf(key) >= 0;

      if (!isValid) {
        model.logger.warn(line`
          Invalid valiation '${key}' will not be added to Model '${model.name}'.
          '${key}' is not an attribute of Model '${model.name}'.
        `);
      }

      if (typeof value !== 'function') {
        isValid = false;

        model.logger.warn(line`
          Invalid valiation '${key}' will not be added to Model '${model.name}'.
          Validations must be a function.
        `);
      }

      return isValid;
    })
    .reduce((hash, [key, value]) => {
      return {
        ...hash,
        [key]: value
      };
    }, Object.create(null));

  return Object.freeze(validates);
}

export default async function initialize(store, model, table) {
  const { hooks, scopes, validates } = model;
  const { logger } = store;

  const attributes = entries(await table().columnInfo())
    .reduce((hash, [columnName, value]) => {
      return {
        ...hash,

        [camelize(columnName, true)]: {
          ...value,
          columnName,

          docName: dasherize(columnName)
        }
      };
    }, {});

  const belongsTo = entries(model.belongsTo || {})
    .reduce((hash, [relatedName, { inverse, model: relatedModel }]) => {
      const relationship = {};

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(relatedModel || singularize(relatedName)),
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        type: {
          value: 'belongsTo',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: `${underscore(relatedName)}_id`,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  const hasOne = entries(model.hasOne || {})
    .reduce((hash, [relatedName, { inverse, model: relatedModel }]) => {
      const relationship = {};

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(relatedModel || singularize(relatedName)),
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        type: {
          value: 'hasOne',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: `${underscore(inverse)}_id`,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  const hasMany = entries(model.hasMany || {})
    .reduce((hash, [relatedName, { inverse, model: relatedModel }]) => {
      const relationship = {};

      Object.defineProperties(relationship, {
        model: {
          value: store.modelFor(relatedModel || singularize(relatedName)),
          writable: false,
          enumerable: true,
          configurable: false
        },

        inverse: {
          value: inverse,
          writable: false,
          enumerable: true,
          configurable: false
        },

        type: {
          value: 'hasMany',
          writable: false,
          enumerable: false,
          configurable: false
        },

        foreignKey: {
          value: `${underscore(inverse)}_id`,
          writable: false,
          enumerable: false,
          configurable: false
        }
      });

      return {
        ...hash,
        [relatedName]: relationship
      };
    }, {});

  Object.defineProperties(model, {
    store: {
      value: store,
      writable: false,
      enumerable: false,
      configurable: false
    },

    table: {
      value: table,
      writable: false,
      enumerable: false,
      configurable: false
    },

    logger: {
      value: logger,
      writable: false,
      enumerable: false,
      configurable: false
    },

    attributes: {
      value: Object.freeze(attributes),
      writable: false,
      enumerable: false,
      configurable: false
    },

    hasOne: {
      value: Object.freeze(hasOne),
      writable: false,
      enumerable: Boolean(Object.keys(hasOne).length),
      configurable: false
    },

    hasMany: {
      value: Object.freeze(hasMany),
      writable: false,
      enumerable: Boolean(Object.keys(hasMany).length),
      configurable: false
    },

    belongsTo: {
      value: Object.freeze(belongsTo),
      writable: false,
      enumerable: Boolean(Object.keys(belongsTo).length),
      configurable: false
    },

    hooks: {
      value: initializeHooks(model, hooks),
      writable: false,
      enumerable: Boolean(Object.keys(hooks).length),
      configurable: false
    },

    scopes: {
      value: scopes,
      writable: false,
      enumerable: Boolean(Object.keys(scopes).length),
      configurable: false
    },

    validates: {
      value: initializeValidations(model, attributes, validates),
      writable: false,
      enumerable: Boolean(Object.keys(validates).length),
      configurable: false
    },

    ...Object.freeze(entries(scopes).reduce((hash, [name, scope]) => {
      return {
        ...hash,

        [name]: {
          value: scope,
          writable: false,
          enumerable: false,
          configurable: false
        }
      };
    }, {}))
  });

  initializeProps(model.prototype, attributes, {
    ...hasOne,
    ...hasMany,
    ...belongsTo
  });

  return model;
}
