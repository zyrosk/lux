/* @flow */

import * as path from 'path'

import slash from 'slash'
import * as fs from 'mz/fs'
import { camelize, capitalize } from 'inflection'

import chain from '@utils/chain'
import underscore from '@utils/underscore'
import { compose } from '@utils/compose'
import noop from '@utils/noop'

import formatName from './format-name'

const createExporter = dist => (name, absolute, isNamedExport) => {
  const relative = path.relative(dist, absolute)
  const normalized = slash(relative)

  if (isNamedExport) {
    return Buffer.from(`export {\n  ${name}\n} from '${normalized}';\n\n`)
  }

  return Buffer.from(
    `export {\n  default as ${name}\n} from '${normalized}';\n\n`
  )
}

const writerForType = (type, file, exporter, handleWrite) => value => {
  const formatIdentifier = compose(
    str => str + capitalize(type),
    formatName,
    str => str.substr(type.length + 2),
    //     ^^^ TODO: Make this less hacky
  )

  return Promise.all(
    value.map(item => {
      if (handleWrite) {
        return handleWrite(item)
      }

      const id = path.join('app', item)

      return fs.appendFile(file, exporter(formatIdentifier(item), id))
    })
  )
}

const createWriter = (file, exporter) => ({
  controllers: writerForType('controller', file, exporter),
  serializers: writerForType('serializer', file, exporter),
  models: writerForType('model', file, exporter, async item => {
    const id = path.join('app', 'models', item)
    const name = formatName(item)

    return fs.appendFile(file, exporter(name, id))
  }),
  migrations: writerForType('migration', file, exporter, async (item) => {
    const id = path.join('db', 'migrate', item)
    const name = chain(item)
      .pipe(str => path.basename(str, '.js'))
      .pipe(underscore)
      .pipe(str => str.substr(17))
      .pipe(str => camelize(str, true))
      .value()

    await Promise.all([
      fs.appendFile(file, exporter(`up as ${name}Up`, id, true)),
      fs.appendFile(file, exporter(`down as ${name}Down`, id, true)),
    ])
  })
})

export default async function createManifest(
  dir: string,
  assets: Map<string, Array<string> | string>,
  { useStrict }: { useStrict: boolean }
): Promise<void> {
  const dist = path.join(dir, 'dist')
  const file = path.join(dist, 'index.js')
  const exporter = createExporter(dist)
  const writer = createWriter(file, exporter)

  await fs.mkdir(dist).catch(noop)
  await fs.writeFile(file, Buffer.from(useStrict ? '\'use strict\';\n\n' : ''))

  const promises = Array
    .from(assets)
    .map(([key, value]) => {
      const write = Reflect.get(writer, key)

      if (write) {
        return write(value)
      } else if (!write && typeof value === 'string') {
        return fs.appendFile(file, exporter(key, value))
      }

      return Promise.resolve()
    })

  await Promise.all(promises)
}
