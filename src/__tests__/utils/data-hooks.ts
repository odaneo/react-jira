import { renderHook } from '@testing-library/react-hooks'
import { useEpic, useEpics } from 'utils/epic'
import { useKanbans, useAddTask } from 'utils/kanban'
import { useProject, useProjects, useTask } from 'utils/project'
import { useTaskTypes } from 'utils/task-type'
import { useTasks } from 'utils/task'
import { useUsers } from 'utils/users'

const mockUseQuery = jest.fn()
const mockUseMutation = jest.fn()
const mockUseHttp = jest.fn()
const mockUseDebounce = jest.fn()
const mockUseAddConfig = jest.fn()
const mockUseDeleteConfig = jest.fn()
const mockUseEditConfig = jest.fn()
const mockUseReorderTaskConfig = jest.fn()
const mockUseReorderKanbanConfig = jest.fn()

jest.mock('react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: (...args: unknown[]) => mockUseMutation(...args)
}))

jest.mock('utils/http', () => ({
  useHttp: () => mockUseHttp()
}))

jest.mock('utils/index', () => ({
  ...jest.requireActual('utils/index'),
  useDebounce: (...args: unknown[]) => mockUseDebounce(...args)
}))

jest.mock('utils/use-optimistic-options', () => ({
  useAddConfig: (...args: unknown[]) => mockUseAddConfig(...args),
  useDeleteConfig: (...args: unknown[]) => mockUseDeleteConfig(...args),
  useEditConfig: (...args: unknown[]) => mockUseEditConfig(...args),
  useReorderTaskConfig: (...args: unknown[]) => mockUseReorderTaskConfig(...args),
  useReorderKanbanConfig: (...args: unknown[]) => mockUseReorderKanbanConfig(...args)
}))

beforeEach(() => {
  const client = jest.fn()
  mockUseHttp.mockReturnValue(client)
  mockUseDebounce.mockImplementation((value: unknown) => value)
  mockUseQuery.mockImplementation((...args: unknown[]) => args)
  mockUseMutation.mockImplementation((...args: unknown[]) => args)
  mockUseAddConfig.mockReturnValue({ tag: 'add' })
  mockUseDeleteConfig.mockReturnValue({ tag: 'delete' })
  mockUseEditConfig.mockReturnValue({ tag: 'edit' })
  mockUseReorderTaskConfig.mockReturnValue({ tag: 'reorder-task' })
  mockUseReorderKanbanConfig.mockReturnValue({ tag: 'reorder-kanban' })
})

test('query hooks build expected keys and options', () => {
  const usersResult = renderHook(() => useUsers({ name: 'Ada', organization: '' as unknown as string }))
  const projectsResult = renderHook(() => useProjects({ name: 'Core', personId: undefined }))
  const projectResult = renderHook(() => useProject(9))
  const taskResult = renderHook(() => useTask(undefined))
  const taskTypesResult = renderHook(() => useTaskTypes())
  const kanbansResult = renderHook(() => useKanbans({ projectId: 5 }))
  const epicsResult = renderHook(() => useEpics({ projectId: 5, name: 'P1' }))
  const epicResult = renderHook(() => useEpic(3))
  const tasksResult = renderHook(() => useTasks({ projectId: 2, name: 'search' }))

  expect(usersResult.result.current[0]).toEqual(['users', { name: 'Ada' }])
  expect(usersResult.result.current[2]).toEqual({ staleTime: 5 * 60 * 1000 })
  expect(projectsResult.result.current[0]).toEqual(['projects', { name: 'Core' }])
  expect(projectResult.result.current[2]).toEqual({ enabled: true })
  expect(taskResult.result.current[2]).toEqual({ enabled: false })
  expect(taskTypesResult.result.current[0]).toEqual(['taskTypes'])
  expect(kanbansResult.result.current[0]).toEqual(['kanbans', { projectId: 5 }])
  expect(epicsResult.result.current[0]).toEqual(['epics', { projectId: 5, name: 'P1' }])
  expect(epicResult.result.current[2]).toEqual({ enabled: true })
  expect(tasksResult.result.current[0]).toEqual(['tasks', { projectId: 2, name: 'search' }])
  expect(mockUseDebounce).toHaveBeenCalledWith('search', 200)
})

test('query hook fetchers call http client with expected endpoint and params', async () => {
  const mockClient = mockUseHttp()

  const usersResult = renderHook(() => useUsers({ name: 'Ada', organization: '' as unknown as string }))
  const projectsResult = renderHook(() => useProjects({ name: 'Core', personId: undefined }))
  const projectResult = renderHook(() => useProject(9))
  const taskTypesResult = renderHook(() => useTaskTypes())
  const tasksResult = renderHook(() => useTasks({ projectId: 2, name: 'search' }))

  await usersResult.result.current[1]()
  await projectsResult.result.current[1]()
  await projectResult.result.current[1]()
  await taskTypesResult.result.current[1]()
  await tasksResult.result.current[1]()

  expect(mockClient).toHaveBeenNthCalledWith(1, 'users', { data: { name: 'Ada' } })
  expect(mockClient).toHaveBeenNthCalledWith(2, 'projects', { data: { name: 'Core', personId: undefined } })
  expect(mockClient).toHaveBeenNthCalledWith(3, 'projects/9')
  expect(mockClient).toHaveBeenNthCalledWith(4, 'taskTypes')
  expect(mockClient).toHaveBeenNthCalledWith(5, 'tasks', { data: { projectId: 2, name: 'search' } })
})

test('useAddTask triggers patch only when reporterId needs correction', async () => {
  const mockClient = mockUseHttp()
  mockClient
    .mockResolvedValueOnce({ id: 11, reporterId: 2 })
    .mockResolvedValueOnce({ id: 11, reporterId: 1 })
    .mockResolvedValueOnce({ id: 12, reporterId: 1 })

  const withPatch = renderHook(() => useAddTask(['tasks']))
  const withoutPatch = renderHook(() => useAddTask(['tasks']))

  const createdWithPatch = await withPatch.result.current[0]({ name: 'new', reporterId: 1 })
  const createdWithoutPatch = await withoutPatch.result.current[0]({ name: 'new-2', reporterId: 1 })

  expect(createdWithPatch).toEqual({ id: 11, reporterId: 1 })
  expect(createdWithoutPatch).toEqual({ id: 12, reporterId: 1 })
  expect(mockClient).toHaveBeenNthCalledWith(1, 'tasks', {
    method: 'POST',
    data: { name: 'new', reporterId: 1 }
  })
  expect(mockClient).toHaveBeenNthCalledWith(2, 'tasks/11', {
    method: 'PATCH',
    data: { reporterId: 1 }
  })
  expect(mockClient).toHaveBeenNthCalledWith(3, 'tasks', {
    method: 'POST',
    data: { name: 'new-2', reporterId: 1 }
  })
})
