import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from './http'
import { Kanban } from 'types/kanban'
import { useAddConfig, useDeleteConfig, useReorderKanbanConfig } from './use-optimistic-options'
import { Task } from 'types/task'

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp()
  return useQuery<Kanban[]>(['kanbans', param], () => client('kanbans', { data: param }))
}

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Kanban>) =>
      client(`kanbans`, {
        method: 'POST',
        data: params
      }),
    useAddConfig(queryKey)
  )
}

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(async (params: Partial<Task>) => {
    const createdTask = await client(`tasks`, {
      method: 'POST',
      data: params
    })
    const reporterId = params.reporterId
    if (reporterId && createdTask?.reporterId !== reporterId) {
      return client(`tasks/${createdTask.id}`, {
        method: 'PATCH',
        data: { reporterId }
      })
    }
    return createdTask
  }, useAddConfig(queryKey))
}

export const useDeleteKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`kanbans/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}

export interface SortProps {
  fromId: number
  referenceId?: number
  type: 'before' | 'after'
  fromKanbanId?: number
  toKanbanId?: number
}

export const useReorderKanban = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: SortProps) =>
      client('kanbans/reorder', {
        data: params,
        method: 'POST'
      }),
    useReorderKanbanConfig(queryKey)
  )
}
