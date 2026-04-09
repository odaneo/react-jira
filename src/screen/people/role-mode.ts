import { useUrlQueryParam } from 'utils/url'

export type PeopleRole = 'manager' | 'member'

export const usePeopleRoleMode = () => {
  const [param, setParam] = useUrlQueryParam(['role'])
  const role: PeopleRole = param.role === 'member' ? 'member' : 'manager'

  return [
    role,
    (nextRole: PeopleRole) =>
      setParam({
        role: nextRole === 'manager' ? undefined : nextRole
      })
  ] as const
}
