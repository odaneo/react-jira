import { renderHook } from '@testing-library/react-hooks'
import { useAddEpic, useDeleteEpic, useEditEpic } from 'utils/epic'
import { useAddKanban, useDeleteKanban, useReorderKanban } from 'utils/kanban'
import { useAddProject, useDeleteProject, useEditProject } from 'utils/project'
import { useDeleteTask, useEditTask, useReorderTask } from 'utils/task'

const mockUseMutation = jest.fn()
const mockUseHttp = jest.fn()
const mockUseAddConfig = jest.fn()
const mockUseDeleteConfig = jest.fn()
const mockUseEditConfig = jest.fn()
const mockUseReorderTaskConfig = jest.fn()
const mockUseReorderKanbanConfig = jest.fn()

jest.mock('react-query', () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: jest.fn()
}))

jest.mock('utils/http', () => ({
  useHttp: () => mockUseHttp()
}))

jest.mock('utils/use-optimistic-options', () => ({
  useAddConfig: (...args: unknown[]) => mockUseAddConfig(...args),
  useDeleteConfig: (...args: unknown[]) => mockUseDeleteConfig(...args),
  useEditConfig: (...args: unknown[]) => mockUseEditConfig(...args),
  useReorderTaskConfig: (...args: unknown[]) => mockUseReorderTaskConfig(...args),
  useReorderKanbanConfig: (...args: unknown[]) => mockUseReorderKanbanConfig(...args)
}))

beforeEach(() => {
  const mockClient = jest.fn().mockResolvedValue({})
  mockUseHttp.mockReturnValue(mockClient)
  mockUseMutation.mockImplementation((...args: unknown[]) => args)
  mockUseAddConfig.mockImplementation(queryKey => ({ configType: 'add', queryKey }))
  mockUseDeleteConfig.mockImplementation(queryKey => ({ configType: 'delete', queryKey }))
  mockUseEditConfig.mockImplementation(queryKey => ({ configType: 'edit', queryKey }))
  mockUseReorderTaskConfig.mockImplementation(queryKey => ({ configType: 'reorder-task', queryKey }))
  mockUseReorderKanbanConfig.mockImplementation(queryKey => ({ configType: 'reorder-kanban', queryKey }))
})

test('project mutation hooks bind http endpoint and config', async () => {
  const queryKey = ['projects', { name: 'a' }]
  const client = mockUseHttp()

  const add = renderHook(() => useAddProject(queryKey)).result.current
  const edit = renderHook(() => useEditProject(queryKey)).result.current
  const del = renderHook(() => useDeleteProject(queryKey)).result.current

  await add[0]({ name: 'P' })
  await edit[0]({ id: 8, name: 'PX' })
  await del[0]({ id: 8 })

  expect(add[1]).toEqual({ configType: 'add', queryKey })
  expect(edit[1]).toEqual({ configType: 'edit', queryKey })
  expect(del[1]).toEqual({ configType: 'delete', queryKey })
  expect(client).toHaveBeenNthCalledWith(1, 'projects', { method: 'POST', data: { name: 'P' } })
  expect(client).toHaveBeenNthCalledWith(2, 'projects/8', { method: 'PATCH', data: { id: 8, name: 'PX' } })
  expect(client).toHaveBeenNthCalledWith(3, 'projects/8', { method: 'DELETE' })
})

test('task mutation hooks bind http endpoint and config', async () => {
  const queryKey = ['tasks', { projectId: 1 }]
  const client = mockUseHttp()

  const edit = renderHook(() => useEditTask(queryKey)).result.current
  const del = renderHook(() => useDeleteTask(queryKey)).result.current
  const reorder = renderHook(() => useReorderTask(queryKey)).result.current

  await edit[0]({ id: 5, name: 'T5' })
  await del[0]({ id: 5 })
  await reorder[0]({ fromId: 5, referenceId: 6, type: 'after', fromKanbanId: 2, toKanbanId: 3 })

  expect(edit[1]).toEqual({ configType: 'edit', queryKey })
  expect(del[1]).toEqual({ configType: 'delete', queryKey })
  expect(reorder[1]).toEqual({ configType: 'reorder-task', queryKey })
  expect(client).toHaveBeenNthCalledWith(1, 'tasks/5', { method: 'PATCH', data: { id: 5, name: 'T5' } })
  expect(client).toHaveBeenNthCalledWith(2, 'tasks/5', { method: 'DELETE' })
  expect(client).toHaveBeenNthCalledWith(3, 'tasks/reorder', {
    data: { fromId: 5, referenceId: 6, type: 'after', fromKanbanId: 2, toKanbanId: 3 },
    method: 'POST'
  })
})

test('kanban mutation hooks bind http endpoint and config', async () => {
  const queryKey = ['kanbans', { projectId: 1 }]
  const client = mockUseHttp()

  const add = renderHook(() => useAddKanban(queryKey)).result.current
  const del = renderHook(() => useDeleteKanban(queryKey)).result.current
  const reorder = renderHook(() => useReorderKanban(queryKey)).result.current

  await add[0]({ name: 'K1', projectId: 1 })
  await del[0]({ id: 10 })
  await reorder[0]({ fromId: 10, referenceId: 11, type: 'before' })

  expect(add[1]).toEqual({ configType: 'add', queryKey })
  expect(del[1]).toEqual({ configType: 'delete', queryKey })
  expect(reorder[1]).toEqual({ configType: 'reorder-kanban', queryKey })
  expect(client).toHaveBeenNthCalledWith(1, 'kanbans', {
    method: 'POST',
    data: { name: 'K1', projectId: 1 }
  })
  expect(client).toHaveBeenNthCalledWith(2, 'kanbans/10', { method: 'DELETE' })
  expect(client).toHaveBeenNthCalledWith(3, 'kanbans/reorder', {
    data: { fromId: 10, referenceId: 11, type: 'before' },
    method: 'POST'
  })
})

test('epic mutation hooks bind http endpoint and config', async () => {
  const queryKey = ['epics', { projectId: 1 }]
  const client = mockUseHttp()

  const add = renderHook(() => useAddEpic(queryKey)).result.current
  const edit = renderHook(() => useEditEpic(queryKey)).result.current
  const del = renderHook(() => useDeleteEpic(queryKey)).result.current

  await add[0]({ name: 'E1', projectId: 1 })
  await edit[0]({ id: 3, name: 'E3' })
  await del[0]({ id: 3 })

  expect(add[1]).toEqual({ configType: 'add', queryKey })
  expect(edit[1]).toEqual({ configType: 'edit', queryKey })
  expect(del[1]).toEqual({ configType: 'delete', queryKey })
  expect(client).toHaveBeenNthCalledWith(1, 'epics', { method: 'POST', data: { name: 'E1', projectId: 1 } })
  expect(client).toHaveBeenNthCalledWith(2, 'epics/3', { method: 'PATCH', data: { id: 3, name: 'E3' } })
  expect(client).toHaveBeenNthCalledWith(3, 'epics/3', { method: 'DELETE' })
})
