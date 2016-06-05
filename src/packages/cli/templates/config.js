// @flow
import template from '../../template';

/**
 * @private
 */
export default (name: string, env: string): string => {
  const isProdENV = env === 'production';

  return template`
    export default {
      log: ${!isProdENV}
    };
  `;
};
