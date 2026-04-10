import { act, renderHook } from '@testing-library/react-hooks'
import { usePeopleInsightsParams, usePeopleQueryKey, usePeopleSearchParams, usePeopleView } from 'screen/people/util'
import { usePeopleRoleMode } from 'screen/people/role-mode'

const mockUseUrlQueryParam = jest.fn()

jest.mock('utils/url', () => ({
  useUrlQueryParam: (...args: unknown[]) => mockUseUrlQueryParam(...args)
}))

test('usePeopleSearchParams maps empty values to undefined', () => {
  const setParam = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([{ name: 'Ada', organization: '' }, setParam])

  const { result } = renderHook(() => usePeopleSearchParams())

  expect(result.current[0]).toEqual({
    name: 'Ada',
    organization: undefined
  })
  expect(result.current[1]).toBe(setParam)
})

test('usePeopleQueryKey removes empty fields', () => {
  mockUseUrlQueryParam.mockReturnValue([{ name: 'Ada', organization: '' }, jest.fn()])

  const { result } = renderHook(() => usePeopleQueryKey())
  expect(result.current).toEqual(['users', { name: 'Ada' }])
})

test('usePeopleView defaults to list and writes undefined for list', () => {
  const setParam = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([{ view: '' }, setParam])
  const { result } = renderHook(() => usePeopleView())

  expect(result.current[0]).toBe('list')

  act(() => {
    result.current[1]('list')
    result.current[1]('insights')
  })

  expect(setParam).toHaveBeenNthCalledWith(1, { view: undefined })
  expect(setParam).toHaveBeenNthCalledWith(2, { view: 'insights' })
})

test('usePeopleInsightsParams maps and writes group field', () => {
  const setParam = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([{ range: '30d', projectId: '8', group: '研发' }, setParam])
  const { result } = renderHook(() => usePeopleInsightsParams())

  expect(result.current[0]).toEqual({
    range: '30d',
    projectId: 8,
    organization: '研发'
  })

  act(() => {
    result.current[1]({ range: '90d', projectId: 9, organization: '平台' })
  })

  expect(setParam).toHaveBeenCalledWith({
    range: '90d',
    projectId: 9,
    group: '平台'
  })
})

test('usePeopleRoleMode defaults to manager and maps manager to undefined', () => {
  const setParam = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([{ role: '' }, setParam])
  const { result } = renderHook(() => usePeopleRoleMode())

  expect(result.current[0]).toBe('manager')

  act(() => {
    result.current[1]('manager')
    result.current[1]('member')
  })

  expect(setParam).toHaveBeenNthCalledWith(1, { role: undefined })
  expect(setParam).toHaveBeenNthCalledWith(2, { role: 'member' })
})
