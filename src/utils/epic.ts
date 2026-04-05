import { QueryKey, useMutation, useQuery } from 'react-query'
import { useHttp } from './http'
import { Epic } from 'types/epic'
import { useAddConfig, useDeleteConfig, useEditConfig } from './use-optimistic-options'

type EpicQuery = Partial<Pick<Epic, 'id' | 'name' | 'projectId'>>

export const useEpics = (param?: EpicQuery) => {
  const client = useHttp()
  return useQuery<Epic[]>(['epics', param], () => client('epics', { data: param }))
}

export const useEpic = (id?: number) => {
  const client = useHttp()
  return useQuery<Epic>(['epic', { id }], () => client(`epics/${id}`), {
    enabled: !!id
  })
}

export const useAddEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Epic>) =>
      client('epics', {
        method: 'POST',
        data: params
      }),
    useAddConfig(queryKey)
  )
}

export const useEditEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Epic>) =>
      client(`epics/${params.id}`, {
        method: 'PATCH',
        data: params
      }),
    useEditConfig(queryKey)
  )
}

export const useDeleteEpic = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`epics/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}
