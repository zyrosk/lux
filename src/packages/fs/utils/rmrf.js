/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

const joinWith = a => b => path.join(a, b)

/**
 * @private
 */
export const rmrf = (target: string): Promise<boolean> =>
  fs.stat(target)
    .then(stats =>
      (stats.isDirectory() ?
        fs.readdir(target)
          .then(files => files.map(joinWith(target)))
          .then(files => files.map(rmrf))
          .then(Promise.all)
        : fs.unlink(target))
    )
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return true
      }

      return err
    })

export default rmrf
