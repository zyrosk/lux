// @flow
import insert from '../../../utils/insert';

const pattern = /(:\w+)/g;

/**
 * @private
 */
export default function getDynamicSegments(path: string): Array<string> {
  const matches = (path.match(pattern) || []).map(part => part.substr(1));
  const dynamicSegments = new Array(matches.length);

  insert(dynamicSegments, matches);

  Object.freeze(dynamicSegments);

  return dynamicSegments;
}
