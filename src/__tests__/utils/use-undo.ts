import { act, renderHook } from '@testing-library/react-hooks'
import { useUndo } from 'utils/use-undo'

test('useUndo supports set undo redo and reset flows', () => {
  const { result } = renderHook(() => useUndo(1))

  expect(result.current[0]).toEqual({
    past: [],
    present: 1,
    future: []
  })
  expect(result.current[1].canUndo).toBe(false)
  expect(result.current[1].canRedo).toBe(false)

  act(() => {
    result.current[1].set(2)
    result.current[1].set(3)
  })

  expect(result.current[0]).toEqual({
    past: [1, 2],
    present: 3,
    future: []
  })
  expect(result.current[1].canUndo).toBe(true)

  act(() => {
    result.current[1].undo()
  })

  expect(result.current[0]).toEqual({
    past: [1],
    present: 2,
    future: [3]
  })
  expect(result.current[1].canRedo).toBe(true)

  act(() => {
    result.current[1].redo()
  })

  expect(result.current[0]).toEqual({
    past: [1, 2],
    present: 3,
    future: []
  })

  act(() => {
    result.current[1].reset(9)
  })

  expect(result.current[0]).toEqual({
    past: [],
    present: 9,
    future: []
  })
  expect(result.current[1].canUndo).toBe(false)
  expect(result.current[1].canRedo).toBe(false)
})

test('useUndo set with same value does not add history', () => {
  const { result } = renderHook(() => useUndo('jira'))

  act(() => {
    result.current[1].set('jira')
  })

  expect(result.current[0]).toEqual({
    past: [],
    present: 'jira',
    future: []
  })
})
