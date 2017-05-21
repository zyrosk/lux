/* @flow */

import toMap from '../to-map'

const keyer = ({ id }) => id

test('it can collect an array of items into a map', () => {
  const items = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
    { id: 3, name: 'Test 3' },
    { id: 4, name: 'Test 4' },
  ]

  expect(toMap(items, keyer)).toMatchSnapshot()
})

test('it ignores the item when the key is null or undefined', () => {
  const items = [
    { id: 1, name: 'Test 1' },
    { id: 2, name: 'Test 2' },
    { id: null, name: 'Test 3' },
    { id: undefined, name: 'Test 4' },
  ]

  expect(toMap(items, keyer)).toMatchSnapshot()
})
