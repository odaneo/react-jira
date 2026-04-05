import { useQuery } from 'react-query'
import { User } from 'types/user'
import { useHttp } from './http'
import { clearObject } from 'utils'

export const useUsers = (params?: Partial<User>) => {
  const client = useHttp()
  const cleanedParams = clearObject(params || {})
  return useQuery<User[]>(['users', cleanedParams], () => client('users', { data: cleanedParams }), {
    staleTime: 5 * 60 * 1000
  })
}
