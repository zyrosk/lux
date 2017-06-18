/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import * as flatten from './flatten'

const joinWith = a => b => path.join(a, b)

export const exists = (target: string): Promise<boolean> =>
  fs.stat(target)
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return false
      }

      return err
    })

export const existsInDir =
  (target: string, pattern: RegExp): Promise<boolean> =>
    fs.readdir(target)
      .then(files =>
        files.some(file => pattern.test(file))
      )

export const readJson = (target: string): Promise<Object> =>
  fs.readFile(target, 'utf8')
    .then(JSON.parse)

/**
 * Recursively read a directory.
 */
export const readdirRec = (target: string): Promise<Array<string>> =>
  fs.readdir(target)
    .then(files => {
      const promises = files
        .map(joinWith(target))
        .map(file =>
          fs.stat(file)
            .then(stats => [file, stats])
        )

      return Promise.all(promises)
    })
    .then(files => {
      const promises = files.map(([file, stats]) => {
        if (stats.isDirectory()) {
          return readdirRec(file)
        }

        return file
      })

      return Promise.all(promises)
    })
    .then(flatten.deep)
    .then(files =>
      files.map(file =>
        file.replace(path.dirname(target) + path.sep, '')
      )
    )
