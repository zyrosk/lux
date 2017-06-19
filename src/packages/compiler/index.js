/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'
import lux from 'rollup-plugin-lux'
import json from 'rollup-plugin-json'
import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import { rollup } from 'rollup'

import { NODE_ENV } from '@constants'
import { rmrf, readdirRec, readJson, isJSFile } from '../fs'

import { BANNER, STD_LIB } from './constants'
import onwarn from './utils/handle-warning'
import createManifest from './utils/create-manifest'
import createBootScript from './utils/create-boot-script'

/**
 * @private
 */
type Options = {
  useStrict?: boolean,
}

let cache

/**
 * @private
 */
export const compile =
  async (dir: string, env: string, opts: Options = {}): Promise<void> => {
    const { useStrict = false } = opts
    const entry = path.join(dir, 'dist', 'index.js')
    let external = STD_LIB
    let banner

    const babelConfig = {
      babelrc: false,
    }

    const assets = await Promise.all([
      fs.readdir(path.join(dir, 'app', 'models')),
      fs.readdir(path.join(dir, 'db', 'migrate')),
      readdirRec(path.join(dir, 'app', 'controllers')),
      readdirRec(path.join(dir, 'app', 'serializers')),
      readJson(path.join(dir, 'package.json')),
      readJson(path.join(dir, '.babelrc')),
    ]).then(types => {
      let [
        models,
        migrations,
        controllers,
        serializers,
      ] = types

      models = models.filter(isJSFile)
      migrations = migrations.filter(isJSFile)
      controllers = controllers.filter(isJSFile)
      serializers = serializers.filter(isJSFile)

      const [, , , , packageInfo, babelRc] = types

      if (packageInfo.dependencies) {
        external = Object.keys(packageInfo.dependencies).concat(external)
      }

      Object.assign(babelConfig, babelRc)

      return new Map([
        ['Application', path.join('app', 'index.js')],
        ['config', path.join('config', 'environments', `${env}.js`)],
        ['controllers', controllers],
        ['database', path.join('config', 'database.js')],
        ['migrations', migrations],
        ['models', models],
        ['routes', path.join('app', 'routes.js')],
        ['seed', path.join('db', 'seed.js')],
        ['serializers', serializers]
      ])
    })

    await Promise.all([
      createManifest(dir, assets, {
        useStrict
      }),
      createBootScript(dir, {
        useStrict
      })
    ])

    const bundle = await rollup({
      cache,
      entry,
      external,
      onwarn,
      plugins: [
        alias({
          app: path.posix.join('/', ...dir.split(path.sep).concat('app')),
          resolve: ['.js'],
        }),
        json(),
        resolve(),
        babel(babelConfig),
        lux(path.resolve(path.sep, dir, 'app')),
        cleanup(),
      ],
      preferConst: true,
    })

    if (NODE_ENV === 'development') {
      cache = bundle
    }

    await rmrf(entry)

    banner = BANNER

    if (useStrict) {
      banner = `'use strict';\n\n${banner}`
    }

    return bundle.write({
      banner,
      dest: path.join(dir, 'dist', 'bundle.js'),
      format: 'cjs',
      sourceMap: true,
      useStrict: false,
    })
  }

export { default as onwarn } from './utils/handle-warning'
