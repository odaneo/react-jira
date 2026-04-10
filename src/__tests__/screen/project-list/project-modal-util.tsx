import { act, renderHook } from '@testing-library/react-hooks'
import { useProjectModal, useProjectsSearchParams } from 'screen/project-list/util'

const mockUseUrlQueryParam = jest.fn()
const mockUseSetUrlSearchParam = jest.fn()
const mockUseProject = jest.fn()

jest.mock('utils/url', () => ({
  useUrlQueryParam: (...args: unknown[]) => mockUseUrlQueryParam(...args),
  useSetUrlSearchParam: () => mockUseSetUrlSearchParam()
}))

jest.mock('utils/project', () => ({
  useProject: (...args: unknown[]) => mockUseProject(...args)
}))

test('useProjectsSearchParams normalizes values', () => {
  const setParam = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([
    {
      name: 'proj',
      personId: '7',
      organization: '',
      pin: 'false'
    },
    setParam
  ])

  const { result } = renderHook(() => useProjectsSearchParams())

  expect(result.current[0]).toEqual({
    name: 'proj',
    personId: 7,
    organization: undefined,
    pin: false
  })
  expect(result.current[1]).toBe(setParam)
})

test('useProjectModal handles open close and startEdit', () => {
  const setProjectCreate = jest.fn()
  const setEditingProjectId = jest.fn()
  const setUrlParams = jest.fn()

  mockUseUrlQueryParam.mockImplementation((keys: string[]) => {
    if (keys[0] === 'projectCreate') {
      return [{ projectCreate: 'false' }, setProjectCreate]
    }
    return [{ editingProjectId: '10' }, setEditingProjectId]
  })
  mockUseSetUrlSearchParam.mockReturnValue(setUrlParams)
  mockUseProject.mockReturnValue({ data: { id: 10, name: 'P10' }, isLoading: false })

  const { result } = renderHook(() => useProjectModal())

  expect(result.current.projectModalOpen).toBe(true)
  expect(result.current.editingProject).toEqual({ id: 10, name: 'P10' })

  act(() => {
    result.current.open()
    result.current.startEdit(11)
    result.current.close()
  })

  expect(setProjectCreate).toHaveBeenCalledWith({ projectCreate: true })
  expect(setEditingProjectId).toHaveBeenCalledWith({ editingProjectId: 11 })
  expect(setUrlParams).toHaveBeenCalledWith({ projectCreate: '', editingProjectId: '' })
})
