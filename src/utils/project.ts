import { QueryKey, useMutation, useQuery } from 'react-query'
import { Project } from 'types/project'
import { Task } from 'types/task'
import { useHttp } from './http'
import { useEditConfig, useAddConfig, useDeleteConfig } from './use-optimistic-options'
import { clearObject } from 'utils'
// import { useAsync } from './use-async'

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp()
  return useQuery<Project[]>(['projects', clearObject(param)], () => client('projects', { data: param }))
}

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: 'PATCH',
        data: params
      }),
    useEditConfig(queryKey)
  )
}

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        method: 'POST',
        data: params
      }),
    useAddConfig(queryKey)
  )
}

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp()
  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: 'DELETE'
      }),
    useDeleteConfig(queryKey)
  )
}

export const useProject = (id?: number) => {
  const client = useHttp()
  return useQuery<Project>(['project', { id }], () => client(`projects/${id}`), {
    enabled: !!id
  })
}

export const useTask = (id?: number) => {
  const client = useHttp()
  return useQuery<Task>(['task', { id }], () => client(`tasks/${id}`), {
    enabled: !!id
  })
}
