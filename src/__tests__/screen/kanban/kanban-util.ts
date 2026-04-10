import { act, renderHook } from '@testing-library/react-hooks'
import {
  useKanbanQueryKey,
  useProjectIdInUrl,
  useTaskModal,
  useTasksQueryKey,
  useTasksSearchParams
} from 'screen/kanban/util'

const mockUseLocation = jest.fn()
const mockUseUrlQueryParam = jest.fn()
const mockUseProject = jest.fn()
const mockUseTask = jest.fn()

jest.mock('react-router', () => ({
  useLocation: () => mockUseLocation()
}))

jest.mock('utils/url', () => ({
  useUrlQueryParam: (...args: unknown[]) => mockUseUrlQueryParam(...args)
}))

jest.mock('utils/project', () => ({
  useProject: (...args: unknown[]) => mockUseProject(...args),
  useTask: (...args: unknown[]) => mockUseTask(...args)
}))

test('useProjectIdInUrl extracts numeric id from pathname', () => {
  mockUseLocation.mockReturnValue({ pathname: '/projects/23/kanban' })
  const { result } = renderHook(() => useProjectIdInUrl())
  expect(result.current).toBe(23)
})

test('useTasksSearchParams normalizes query values', () => {
  mockUseLocation.mockReturnValue({ pathname: '/projects/9/kanban' })
  mockUseUrlQueryParam.mockReturnValue([
    {
      name: 'abc',
      typeId: '3',
      processorId: '',
      reporterId: '5',
      epicId: ''
    },
    jest.fn()
  ])

  const { result } = renderHook(() => useTasksSearchParams())
  expect(result.current).toEqual({
    projectId: 9,
    name: 'abc',
    typeId: 3,
    processorId: undefined,
    reporterId: 5,
    epicId: undefined
  })
})

test('useTaskModal exposes editingTask and updates url state', () => {
  const setEditingTaskId = jest.fn()
  mockUseLocation.mockReturnValue({ pathname: '/projects/1/kanban' })
  mockUseUrlQueryParam.mockReturnValue([{ editingTaskId: '7' }, setEditingTaskId])
  mockUseTask.mockReturnValue({ data: { id: 7, name: 'T-7' }, isLoading: false })

  const { result } = renderHook(() => useTaskModal())

  expect(result.current.editingTaskId).toBe('7')
  expect(result.current.editingTask).toEqual({ id: 7, name: 'T-7' })

  act(() => {
    result.current.startEdit(9)
    result.current.close()
  })

  expect(setEditingTaskId).toHaveBeenNthCalledWith(1, { editingTaskId: 9 })
  expect(setEditingTaskId).toHaveBeenNthCalledWith(2, { editingTaskId: '' })
})

test('useKanbanQueryKey and useTasksQueryKey build stable query keys', () => {
  mockUseLocation.mockReturnValue({ pathname: '/projects/6/kanban' })
  mockUseUrlQueryParam.mockReturnValue([
    { name: '', typeId: '', processorId: '', reporterId: '', epicId: '' },
    jest.fn()
  ])
  mockUseProject.mockReturnValue({ data: null })
  mockUseTask.mockReturnValue({ data: null, isLoading: false })

  const kanbanKey = renderHook(() => useKanbanQueryKey())
  const taskKey = renderHook(() => useTasksQueryKey())

  expect(kanbanKey.result.current).toEqual(['kanbans', { projectId: 6 }])
  expect(taskKey.result.current).toEqual([
    'tasks',
    {
      projectId: 6,
      name: '',
      typeId: undefined,
      processorId: undefined,
      reporterId: undefined,
      epicId: undefined
    }
  ])
})
