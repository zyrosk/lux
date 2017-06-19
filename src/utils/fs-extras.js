/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import * as flatten from '@utils/flatten'

export const rmrf = (target: string): Promise<boolean> =>
  fs.stat(target)
    .then(stats =>
      (stats.isDirectory() ?
        fs.readdir(target)
          .then(files => files.map(file => path.join(target, file)))
          .then(files => files.map(rmrf))
          .then(promises => Promise.all(promises))
        : fs.unlink(target))
    )
    .then(() => true)
    .catch(err => {
      if (err.code === 'ENOENT') {
        return true
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
export const readdirRec =
  (target: string, stripPath?: boolean = true): Promise<Array<string>> =>
    fs.readdir(target)
      .then(files =>
        files.map(file => path.join(target, file))
          .map(file =>
            fs.stat(file)
              .then(stats => [file, stats])
          )
      )
      .then(promises => Promise.all(promises))
      .then(files =>
        files.map(([file, stats]) => {
          if (stats.isDirectory()) {
            return readdirRec(file, false)
          }
          return file
        })
      )
      .then(promises => Promise.all(promises))
      .then(flatten.shallow)
      .then(files =>
        (stripPath
          ? files.map(file => path.relative(path.dirname(target), file))
          : files)
      )

export const mkdirRec = (target: string) =>
  fs.mkdir(path.dirname(target))
    .catch(err => {
      if (err.code === 'ENOENT') {
        return mkdirRec(path.dirname(target))
      }
      return err
    })
    .then(() =>
      fs.mkdir(target)
    )
