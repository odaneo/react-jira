import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useAddConfig, useConfig, useReorderTaskConfig } from 'utils/use-optimistic-options'

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

test('useConfig onMutate updates cache and onError rolls back', async () => {
  const queryClient = new QueryClient()
  const queryKey = ['projects']
  const oldList = [{ id: 1, name: 'A' }]
  queryClient.setQueryData(queryKey, oldList)

  const { result } = renderHook(() => useConfig(queryKey, (target, old = []) => [...old, target]), {
    wrapper: createWrapper(queryClient)
  })

  let context: { previousItems: unknown } | undefined
  await act(async () => {
    context = await result.current.onMutate({ id: 2, name: 'B' })
  })

  expect(queryClient.getQueryData(queryKey)).toEqual([
    { id: 1, name: 'A' },
    { id: 2, name: 'B' }
  ])
  expect(context).toEqual({ previousItems: oldList })

  act(() => {
    result.current.onError(new Error('x'), {}, context)
  })

  expect(queryClient.getQueryData(queryKey)).toEqual(oldList)
})

test('useAddConfig creates id when target has no id', async () => {
  const queryClient = new QueryClient()
  const queryKey = ['kanbans']

  const { result } = renderHook(() => useAddConfig(queryKey), {
    wrapper: createWrapper(queryClient)
  })

  await act(async () => {
    await result.current.onMutate({ name: 'new-kanban' })
  })

  const list = queryClient.getQueryData(queryKey) as Array<{ id: number; name: string }>
  expect(Array.isArray(list)).toBe(true)
  expect(list[0].name).toBe('new-kanban')
  expect(typeof list[0].id).toBe('number')
})

test('useReorderTaskConfig reorders tasks and updates moved task kanbanId', async () => {
  const queryClient = new QueryClient()
  const queryKey = ['tasks']
  queryClient.setQueryData(queryKey, [
    { id: 1, kanbanId: 1, name: 't1' },
    { id: 2, kanbanId: 1, name: 't2' },
    { id: 3, kanbanId: 2, name: 't3' }
  ])

  const { result } = renderHook(() => useReorderTaskConfig(queryKey), {
    wrapper: createWrapper(queryClient)
  })

  await act(async () => {
    await result.current.onMutate({
      fromId: 1,
      referenceId: 3,
      type: 'after',
      toKanbanId: 2
    })
  })

  expect(queryClient.getQueryData(queryKey)).toEqual([
    { id: 2, kanbanId: 1, name: 't2' },
    { id: 3, kanbanId: 2, name: 't3' },
    { id: 1, kanbanId: 2, name: 't1' }
  ])
})
