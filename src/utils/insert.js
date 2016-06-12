/**
 * @private
 */
export default function insert(
  target: Array<any>,
  items: Array<any>
): Array<any> {
  for (let i = 0; i < items.length; i++) {
    target[i] = items[i];
  }

  return target;
}
