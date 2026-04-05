import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'
import { useProject, useTask } from 'utils/project'
import { useUrlQueryParam } from 'utils/url'

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation()
  const id = pathname.match(/projects\/(\d+)/)?.[1]

  return Number(id)
}

export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useKanbanSearchParams = () => ({ projectId: useProjectIdInUrl() })

export const useKanbanQueryKey = () => ['kanbans', useKanbanSearchParams()]

export const useTasksSearchParams = () => {
  const [param] = useUrlQueryParam(['name', 'typeId', 'processorId', 'reporterId', 'epicId'])

  const projectId = useProjectIdInUrl()

  return useMemo(
    () => ({
      projectId: projectId,
      name: param.name,
      typeId: Number(param.typeId) || undefined,
      processorId: Number(param.processorId) || undefined,
      reporterId: Number(param.reporterId) || undefined,
      epicId: Number(param.epicId) || undefined
    }),
    [projectId, param]
  )
}

export const useTasksQueryKey = () => ['tasks', useTasksSearchParams()]

export const useTaskModal = () => {
  const [{ editingTaskId }, setEditingTaskId] = useUrlQueryParam(['editingTaskId'])
  const { data: editingTask, isLoading } = useTask(Number(editingTaskId))

  const startEdit = useCallback(
    (id: number) => {
      setEditingTaskId({ editingTaskId: id })
    },
    [setEditingTaskId]
  )

  const close = useCallback(() => {
    setEditingTaskId({ editingTaskId: '' })
  }, [setEditingTaskId])

  return {
    editingTaskId,
    editingTask,
    startEdit,
    close,
    isLoading
  }
}
