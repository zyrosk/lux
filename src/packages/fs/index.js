/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import Watcher from './watcher'

export * from 'utils/fs-extras'
export { default as rmrf } from './utils/rmrf'
export { default as isJSFile } from './utils/is-js-file'
export { default as parsePath } from './utils/parse-path'

/**
 * @private
 */
export function watch(watchPath: string): Promise<Watcher> {
  return new Watcher(watchPath)
}

/**
 * @private
 */
export function mkdirRec(dirPath: string, mode: number = 511): Promise<void> {
  const parent = path.resolve(dirPath, '..')

  return fs.stat(parent)
    .catch(() => mkdirRec(parent, mode))
    .then(() => fs.mkdir(dirPath, mode))
    .catch(err => {
      if (err.code !== 'EEXIST') {
        return Promise.reject(err)
      }
      return Promise.resolve()
    })
}
