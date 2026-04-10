import { reorder } from 'utils/reorder'

test('reorder supports moving item after a reference item', () => {
  const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  const result = reorder({ list: original, fromId: 2, type: 'after', referenceId: 3 })

  expect(result.map(item => item.id)).toEqual([1, 3, 2, 4])
  expect(original.map(item => item.id)).toEqual([1, 2, 3, 4])
})

test('reorder supports moving item before a reference item', () => {
  const result = reorder({
    list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    fromId: 3,
    type: 'before',
    referenceId: 1
  })

  expect(result.map(item => item.id)).toEqual([3, 1, 2, 4])
})

test('reorder moves item to tail when referenceId is missing', () => {
  const result = reorder({
    list: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    fromId: 2,
    type: 'after',
    referenceId: 0
  })

  expect(result.map(item => item.id)).toEqual([1, 3, 4, 2])
})
