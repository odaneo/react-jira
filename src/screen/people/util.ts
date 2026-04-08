import { useMemo } from 'react'
import { User } from 'types/user'
import { clearObject } from 'utils'
import { useUrlQueryParam } from 'utils/url'

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
