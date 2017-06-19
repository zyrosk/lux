/* @flow */

import * as fs from 'mz/fs'

import * as fse from '@utils/fs-extras'
import { parsePath } from '../../../fs'
import type { Generator$opts } from '../index'

export function detectConflict(path: string): Promise<boolean> {
  const { dir, base } = parsePath(path)
  const pattern = new RegExp(`^\\d+-${base.substr(17)}$`)

  return fse.existsInDir(dir, pattern)
}

export function createConflictResolver({ cwd, onConflict }: {
  cwd: $PropertyType<Generator$opts, 'cwd'>;
  onConflict: $PropertyType<Generator$opts, 'onConflict'>;
}): $PropertyType<Generator$opts, 'onConflict'> {
  return async path => {
    if (await onConflict(path)) {
      const parsed = parsePath(cwd, path)
      const migrations = await fs.readdir(parsed.dir)

      return migrations.find(
        file => file.substr(17) === parsed.base.substr(17)
      ) || false
    }

    return false
  }
}
