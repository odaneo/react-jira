import { useMemo } from 'react'
import { URLSearchParamsInit, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { clearObject } from 'utils'

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams()
  const setSearchParams = useSetUrlSearchParam()

  return [
    useMemo(() => {
      return keys.reduce((prev: { [key in K]: string }, key: K) => {
        return { ...prev, [key]: searchParams.get(key) || '' }
      }, {} as { [key in K]: string })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]),
    (param: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(param)
    }
  ] as const
}

export const useSetUrlSearchParam = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  return (params: { [key in string]: unknown }) => {
    const nextParams = clearObject({ ...Object.fromEntries(searchParams), ...params }) as URLSearchParamsInit
    const searchRecord = Object.entries(nextParams).reduce((record, [key, value]) => {
      record[key] = Array.isArray(value) ? value.join(',') : String(value)
      return record
    }, {} as Record<string, string>)
    const nextSearch = new URLSearchParams(searchRecord).toString()

    return navigate({
      pathname: location.pathname,
      search: nextSearch ? `?${nextSearch}` : ''
    })
  }
}
