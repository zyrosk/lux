
'use strict';

require('../../../lib/babel-hook');

const SRC = '../../../src';

const fs = require('fs');
const path = require('path');

// Plugins
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');

const compiler = require(`${SRC}/packages/compiler`);
const { default: template } = require(`${SRC}/packages/template`);

const banner = template`

  'use strict';

  require('source-map-support').install({
    environment: 'node'
  });
`;

module.exports = {
  rollup: compiler.createRollupConfig({
    plugins: [
      json(),
      babel(),
      nodeResolve({ preferBuiltins: true })
    ],
    external: [
      'knex',
      'bundle',
      path.join(__dirname, '..', '..', '..', 'lib', 'fs', 'index.js'),
      ...fs.readdirSync(path.join(__dirname, '..', '..', '..', 'node_modules'))
    ]
  }),
  bundle: compiler.createBundleConfig({
    banner
  })
};
