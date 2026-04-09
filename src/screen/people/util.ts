import { useMemo } from 'react'
import { User } from 'types/user'
import { clearObject } from 'utils'
import { useUrlQueryParam } from 'utils/url'

export type PeopleView = 'list' | 'insights' | 'workbench'
export type PeopleInsightsRange = 'all' | '30d' | '90d'

export const usePeopleSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(['name', 'organization'])

  return [
    useMemo(
      () =>
        ({
          name: param.name || undefined,
          organization: param.organization || undefined
        } as Partial<Pick<User, 'name' | 'organization'>>),
      [param]
    ),
    setParam
  ] as const
}

export const usePeopleQueryKey = () => {
  const [params] = usePeopleSearchParams()
  return ['users', clearObject(params)]
}

export const usePeopleView = () => {
  const [param, setParam] = useUrlQueryParam(['view'])
  const view: PeopleView = param.view === 'insights' ? 'insights' : param.view === 'workbench' ? 'workbench' : 'list'

  return [
    view,
    (nextView: PeopleView) =>
      setParam({
        view: nextView === 'list' ? undefined : nextView
      })
  ] as const
}

export const usePeopleInsightsParams = () => {
  const [param, setParam] = useUrlQueryParam(['range', 'projectId', 'group'])

  return [
    useMemo(
      () => ({
        range: (param.range as PeopleInsightsRange) || 'all',
        projectId: param.projectId ? Number(param.projectId) : undefined,
        organization: param.group || ''
      }),
      [param]
    ),
    (nextParam: Partial<{ range: PeopleInsightsRange; projectId?: number; organization: string }>) => {
      return setParam({
        range: nextParam.range,
        projectId: nextParam.projectId,
        group: nextParam.organization
      })
    }
  ] as const
}
