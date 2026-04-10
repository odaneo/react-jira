import { act, renderHook } from '@testing-library/react-hooks'
import { useSetUrlSearchParam, useUrlQueryParam } from 'utils/url'

const mockNavigate = jest.fn()
const mockUseSearchParams = jest.fn()
const mockUseLocation = jest.fn()

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => mockUseSearchParams(),
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockNavigate
  }
})

beforeEach(() => {
  mockNavigate.mockClear()
})

test('useSetUrlSearchParam merges params and serializes array values', () => {
  mockUseSearchParams.mockReturnValue([new URLSearchParams('name=old&archived=false')])
  mockUseLocation.mockReturnValue({ pathname: '/projects/1' })

  const { result } = renderHook(() => useSetUrlSearchParam())

  act(() => {
    result.current({
      name: 'new',
      personId: 2,
      labels: [1, 3],
      archived: undefined
    })
  })

  expect(mockNavigate).toHaveBeenCalledTimes(1)
  const arg = mockNavigate.mock.calls[0][0]
  expect(arg.pathname).toBe('/projects/1')
  const next = new URLSearchParams(arg.search.replace(/^\?/, ''))
  expect(next.get('name')).toBe('new')
  expect(next.get('personId')).toBe('2')
  expect(next.get('labels')).toBe('1,3')
  expect(next.get('archived')).toBeNull()
})

test('useSetUrlSearchParam navigates with empty search when all params are cleared', () => {
  mockUseSearchParams.mockReturnValue([new URLSearchParams('name=jira')])
  mockUseLocation.mockReturnValue({ pathname: '/projects' })

  const { result } = renderHook(() => useSetUrlSearchParam())

  act(() => {
    result.current({ name: '' })
  })

  expect(mockNavigate).toHaveBeenCalledWith({
    pathname: '/projects',
    search: ''
  })
})

test('useUrlQueryParam returns selected params and delegates updates', () => {
  mockUseSearchParams.mockReturnValue([new URLSearchParams('name=demo&typeId=2')])
  mockUseLocation.mockReturnValue({ pathname: '/kanban' })

  const { result } = renderHook(() => useUrlQueryParam(['name', 'typeId', 'missing']))

  expect(result.current[0]).toEqual({
    name: 'demo',
    typeId: '2',
    missing: ''
  })

  act(() => {
    result.current[1]({ name: 'new-name' })
  })

  expect(mockNavigate).toHaveBeenCalled()
})
