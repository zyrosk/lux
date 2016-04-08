import { dasherize, underscore } from 'inflection';

import validate from './validate';
import omit from '../../../utils/omit';
import tryCatch from '../../../utils/try-catch';
import {
  getClassMethods,
  getInstanceMethods
} from '../../../utils/get-methods';

const { keys } = Object;

export default function adapter(model) {
  const name = dasherize(underscore(model.name));
  const methods = getInstanceMethods(model);
  const classMethods = getClassMethods(model);
  let i, key, objKeys, options, relModel, hook;

  const attributes = {
    ...model.attributes
  };

  const hasOne = {
    ...model.hasOne
  };

  const hasMany = {
    ...model.hasMany
  };

  const validations = {
    ...model.validations
  };

  const hooks = {
    beforeValidation: () => true,
    ...model.hooks
  };

  objKeys = keys(attributes);

  for (i = 0; i < objKeys.length; i++) {
    key = objKeys[i];
    attributes[key] = {
      mapsTo: underscore(key),
      ...attributes[key]
    };
  }

  objKeys = keys(hasOne);

  for (i = 0; i < objKeys.length; i++) {
    key = objKeys[i];
    options = hasOne[key];
    relModel = options.model;

    hasOne[key] = [
      key,
      relModel,

      {
        autoFetch: true,
        autoFetchLimit: 25,
        ...omit(options, 'model')
      }
    ];
  }

  objKeys = keys(hasMany);

  for (i = 0; i < objKeys.length; i++) {
    key = objKeys[i];
    options = hasMany[key];
    relModel = options.model;

    hasMany[key] = [
      key,
      relModel,

      {
        autoFetch: true,
        autoFetchLimit: 50,
        ...omit(options, 'model')
      }
    ];
  }

  objKeys = keys(hooks);

  for (i = 0; i < objKeys.length; i++) {
    key = objKeys[i];
    hook = hooks[key];

    if (typeof hook === 'function') {
      hooks[key] = async function (next) {
        let err;

        await tryCatch(async () => {
          await hook.call(this);

          if (key === 'beforeValidation') {
            validate(this, validations);
          }
        }, ex => {
          err = ex;
        });

        if (typeof next === 'function') {
          return next(err);
        }
      };
    }
  }

  return [
    attributes,

    {
      hooks,
      methods: {
        ...methods,
        getModelName() {
          return name;
        }
      }
    },

    classMethods,
    hasOne,
    hasMany
  ];
}
