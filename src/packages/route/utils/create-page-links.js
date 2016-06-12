// @flow
import querystring from 'querystring';

import omit from '../../../utils/omit';

export default function createPageLinks({
  page,
  limit,
  total,
  query,
  domain,
  pathname,
  defaultPerPage
}: {
  page: number,
  limit: number,
  total: number,
  query: Object,
  domain: string,
  pathname: string,
  defaultPerPage: number
}): {
  first: string,
  last: string,
  prev: ?string,
  next: ?string
} {
  const params = omit(query, 'limit', 'page');
  const lastPageNum = total > 0 ? Math.ceil(total / limit) : 1;
  let base = domain + pathname;
  let prev = null;
  let next = null;
  let last = null;
  let first = null;

  if (limit !== defaultPerPage) {
    params.limit = limit;
  }

  if (Object.keys(params).length) {
    base += '?';
    first = base + querystring.stringify(params);
  } else {
    first = base;
    base += '?';
  }

  if (lastPageNum > 1) {
    last = base + querystring.stringify({
      ...params,
      page: lastPageNum
    });
  } else {
    last = first;
  }

  if (page > 1) {
    if (page === 2) {
      prev = first;
    } else {
      prev = base + querystring.stringify({
        ...params,
        page: page - 1
      });
    }
  }

  if (page < lastPageNum) {
    next = base + querystring.stringify({
      ...params,
      page: page + 1
    });
  }

  return {
    first,
    last,
    prev,
    next
  };
}
