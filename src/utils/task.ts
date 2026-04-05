import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from './http'
import { Task } from 'types/task'
import { useDeleteConfig, useEditConfig, useReorderTaskConfig } from './use-optimistic-options'
import { useDebounce } from 'utils/index'
import { SortProps } from './kanban'

type TaskQuery = Partial<
  Pick<Task, 'id' | 'name' | 'projectId' | 'processorId' | 'reporterId' | 'kanbanId' | 'epicId' | 'typeId'>
>

export const useTasks = (param?: TaskQuery) => {
  const client = useHttp()
  const debouncedParam = { ...param, name: useDebounce(param?.name, 200) }

  return useQuery<Task[]>(['tasks', debouncedParam], () => client('tasks', { data: debouncedParam }))
}

export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: 'PATCH',
        data: params
      }),
    useEditConfig(queryKey)
  )
}

export const useDeleteTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`tasks/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}

export const useReorderTask = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: SortProps) =>
      client('tasks/reorder', {
        data: params,
        method: 'POST'
      }),
    useReorderTaskConfig(queryKey)
  )
}
