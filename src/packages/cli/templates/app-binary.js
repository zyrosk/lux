export default (name) => {
  return `
require('babel-core/register');
module.exports = require('../app').default;
  `.substr(1).trim();
};
