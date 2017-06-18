/* @flow */

import type { Model } from '../index'; // eslint-disable-line no-unused-vars

// $FlowFixMe
export type Transaction$ResultProxy<+T: Model, U: boolean> = T & {
  didPersist: U;
  unwrap(): T;
};
