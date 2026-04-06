/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryKey, useQueryClient } from 'react-query'
import { Task } from 'types/task'
import { reorder } from './reorder'
// 乐观更新
export const useConfig = (queryKey: QueryKey, callback: (target: any, old?: any[]) => any[]) => {
  const queryClient = useQueryClient()
  return {
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old?: any[]) => {
        return callback(target, old)
      })
      return { previousItems }
    },
    onError: (error: any, newItem: any, context: any) => {
      queryClient.setQueryData(queryKey, context.previousItems)
    }
  }
}

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old: any[] | undefined) => old?.filter(project => project.id !== target.id) || [])

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old: any[] | undefined) =>
      old?.map(project => (project.id === target.id ? { ...project, ...target } : project)) || []
  )

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old: any[] | undefined) => {
    const item = target?.id ? target : { ...target, id: Date.now() }
    return old ? [...old, item] : [item]
  })

export const useReorderKanbanConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => reorder({ list: old, ...target }))

export const useReorderTaskConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => {
    const orderedList = reorder({ list: old, ...target }) as Task[]
    return orderedList.map(item => (item.id === target.fromId ? { ...item, kanbanId: target.toKanbanId } : item))
  })
