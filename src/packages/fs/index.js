/* @flow */

import Watcher from './watcher'

export * from '@utils/fs-extras'
export { default as isJSFile } from './utils/is-js-file'
export { default as parsePath } from './utils/parse-path'

/**
 * @private
 */
export function watch(watchPath: string): Promise<Watcher> {
  return new Watcher(watchPath)
}
