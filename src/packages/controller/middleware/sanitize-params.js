import { camelize } from 'inflection';

import pick from '../../../utils/pick';

const { keys, assign } = Object;

export default function sanitizeParams(req, res) {
  const { modelName, serializedAttributes } = this;
  const params = { ...req.params };
  let i, key, value;
  let { page, limit, sort, filter, include, fields } = params;

  if (!page) {
    page = 1;
  } else if (typeof page === 'string') {
    page = parseInt(page, 10);
  }

  if (!limit) {
    limit = 25;
  } else if (typeof limit === 'string') {
    limit = parseInt(limit, 10);
  }

  if (!sort) {
    sort = 'createdAt';
  } else {
    if (sort.charAt(0) === '-') {
      sort = `-${sort.substr(1).replace(/\-/g, '_')}`;
    } else {
      sort = sort.replace(/\-/g, '_');
    }

    sort = camelize(sort, true);

    if (this.sort.indexOf(sort) < 0 &&
      this.sort.indexOf(sort.substr(1)) < 0) {
        sort = 'createdAt';
    }
  }

  if (!filter) {
    filter = {};
  }

  if (!include || typeof include !== 'string') {
    include = [];
  } else {
    if (include.indexOf(',') >= 0) {
      include = include.split(',');
    } else {
      include = [include];
    }
  }

  if (!fields) {
    fields = {};
  } else {
    const fieldKeys = keys(fields);

    for (i = 0; i < fieldKeys.length; i++) {
      key = fieldKeys[i];
      value = fields[key];

      if (typeof value === 'string') {
        value = [value];
      }

      if (key === modelName) {
        if (value.length) {
          value = serializedAttributes.filter(attr => {
            return attr.indexOf('id') >= 0 || value.indexOf(attr) >= 0;
          });
        } else {
          value = serializedAttributes;
        }
      }

      fields[key] = value;
    }
  }

  req.params = {
    id: params.id,
    filter: pick(filter, ...this.filter),

    page,
    limit,
    sort,
    include,
    fields
  };

  if (/^(POST|PATCH)$/g.test(req.method)) {
    let { type, attributes } = params.data;

    assign(req.params, {
      data: {
        id: params.data.id,

        type,
        attributes: pick(attributes, ...this.params)
      }
    });
  }
}
