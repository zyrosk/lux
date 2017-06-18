/* @flow */

import type Request from '../../../request';
import type Response from '../../../response';

export type Action<T> =
  (request: Request, response: Response, data?: T) => Promise<T>
