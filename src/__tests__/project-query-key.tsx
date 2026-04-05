import { renderHook } from '@testing-library/react-hooks'

jest.mock('utils/url', () => ({
  useUrlQueryParam: jest.fn(() => [{ name: '', personId: '' }, jest.fn()]),
  useSetUrlSearchParam: jest.fn()
}))

test('useProjectQueryKey 返回与 useProjects 一致的清洗后参数', () => {
  const { useProjectQueryKey } = require('screen/project-list/util')
  const { result } = renderHook(() => useProjectQueryKey())
  expect(result.current).toEqual(['projects', {}])
})
