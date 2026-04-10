import { clearObject, isFalsy, isVoid } from 'utils'

test('isFalsy keeps 0 as truthy business value and marks empty string as falsy', () => {
  expect(isFalsy(0)).toBe(false)
  expect(isFalsy('')).toBe(true)
  expect(isFalsy(false)).toBe(true)
})

test('isVoid marks undefined, null and empty string as void values', () => {
  expect(isVoid(undefined)).toBe(true)
  expect(isVoid(null)).toBe(true)
  expect(isVoid('')).toBe(true)
  expect(isVoid(0)).toBe(false)
})

test('clearObject removes only void fields', () => {
  expect(
    clearObject({
      name: 'jira',
      empty: '',
      age: undefined,
      owner: null,
      count: 0,
      pin: false
    })
  ).toEqual({
    name: 'jira',
    count: 0,
    pin: false
  })
})

test('clearObject returns empty object when input is undefined', () => {
  expect(clearObject(undefined)).toEqual({})
})
