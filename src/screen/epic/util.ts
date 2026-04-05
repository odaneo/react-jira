import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'
import { useProject } from 'utils/project'
import { useEpic } from 'utils/epic'
import { useSetUrlSearchParam, useUrlQueryParam } from 'utils/url'

export const useProjectIdInUrl = () => {
  const { pathname } = useLocation()
  const id = pathname.match(/projects\/(\d+)/)?.[1]
  return Number(id)
}

export const useProjectInUrl = () => useProject(useProjectIdInUrl())

export const useEpicsSearchParams = () => {
  const [param] = useUrlQueryParam(['name'])
  const projectId = useProjectIdInUrl()

  return useMemo(
    () => ({
      projectId,
      name: param.name
    }),
    [projectId, param]
  )
}

export const useEpicQueryKey = () => ['epics', useEpicsSearchParams()]

export const useEpicModal = () => {
  const [{ epicCreate }, setEpicCreate] = useUrlQueryParam(['epicCreate'])
  const [{ editingEpicId }, setEditingEpicId] = useUrlQueryParam(['editingEpicId'])
  const setUrlParams = useSetUrlSearchParam()

  const { data: editingEpic, isLoading } = useEpic(Number(editingEpicId))

  const open = useCallback(() => setEpicCreate({ epicCreate: true }), [setEpicCreate])
  const close = useCallback(() => setUrlParams({ epicCreate: '', editingEpicId: '' }), [setUrlParams])
  const startEdit = useCallback((id: number) => setEditingEpicId({ editingEpicId: id }), [setEditingEpicId])

  return {
    epicModalOpen: epicCreate === 'true' || Boolean(editingEpicId),
    editingEpicId,
    open,
    close,
    startEdit,
    editingEpic,
    isLoading
  }
}

export const useEpicPreview = () => {
  const [{ epicPreviewId }, setEpicPreviewId] = useUrlQueryParam(['epicPreviewId'])

  const open = useCallback((id: number) => setEpicPreviewId({ epicPreviewId: id }), [setEpicPreviewId])
  const close = useCallback(() => setEpicPreviewId({ epicPreviewId: '' }), [setEpicPreviewId])

  return {
    epicPreviewId: Number(epicPreviewId) || undefined,
    open,
    close
  }
}
