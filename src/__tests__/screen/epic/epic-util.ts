import { act, renderHook } from '@testing-library/react-hooks'
import { useEpicModal, useEpicPreview, useEpicsSearchParams, useProjectIdInUrl } from 'screen/epic/util'

const mockUseLocation = jest.fn()
const mockUseUrlQueryParam = jest.fn()
const mockUseSetUrlSearchParam = jest.fn()
const mockUseProject = jest.fn()
const mockUseEpic = jest.fn()

jest.mock('react-router', () => ({
  useLocation: () => mockUseLocation()
}))

jest.mock('utils/url', () => ({
  useUrlQueryParam: (...args: unknown[]) => mockUseUrlQueryParam(...args),
  useSetUrlSearchParam: () => mockUseSetUrlSearchParam()
}))

jest.mock('utils/project', () => ({
  useProject: (...args: unknown[]) => mockUseProject(...args)
}))

jest.mock('utils/epic', () => ({
  useEpic: (...args: unknown[]) => mockUseEpic(...args)
}))

test('useProjectIdInUrl extracts project id', () => {
  mockUseLocation.mockReturnValue({ pathname: '/projects/88/epic' })
  const { result } = renderHook(() => useProjectIdInUrl())
  expect(result.current).toBe(88)
})

test('useEpicsSearchParams returns projectId and name', () => {
  mockUseLocation.mockReturnValue({ pathname: '/projects/5/epic' })
  mockUseUrlQueryParam.mockReturnValue([{ name: 'backend' }, jest.fn()])

  const { result } = renderHook(() => useEpicsSearchParams())
  expect(result.current).toEqual({
    projectId: 5,
    name: 'backend'
  })
})

test('useEpicModal controls open close and startEdit actions', () => {
  const setEpicCreate = jest.fn()
  const setEditingEpicId = jest.fn()
  const setUrlParams = jest.fn()

  mockUseLocation.mockReturnValue({ pathname: '/projects/5/epic' })
  mockUseUrlQueryParam.mockImplementation((keys: string[]) => {
    if (keys[0] === 'epicCreate') {
      return [{ epicCreate: 'false' }, setEpicCreate]
    }
    return [{ editingEpicId: '12' }, setEditingEpicId]
  })
  mockUseSetUrlSearchParam.mockReturnValue(setUrlParams)
  mockUseEpic.mockReturnValue({ data: { id: 12, name: 'E-12' }, isLoading: false })

  const { result } = renderHook(() => useEpicModal())

  expect(result.current.epicModalOpen).toBe(true)
  expect(result.current.editingEpicId).toBe('12')
  expect(result.current.editingEpic).toEqual({ id: 12, name: 'E-12' })

  act(() => {
    result.current.open()
    result.current.startEdit(21)
    result.current.close()
  })

  expect(setEpicCreate).toHaveBeenCalledWith({ epicCreate: true })
  expect(setEditingEpicId).toHaveBeenCalledWith({ editingEpicId: 21 })
  expect(setUrlParams).toHaveBeenCalledWith({ epicCreate: '', editingEpicId: '' })
})

test('useEpicPreview maps id and controls open close', () => {
  const setEpicPreviewId = jest.fn()
  mockUseUrlQueryParam.mockReturnValue([{ epicPreviewId: '33' }, setEpicPreviewId])

  const { result } = renderHook(() => useEpicPreview())

  expect(result.current.epicPreviewId).toBe(33)

  act(() => {
    result.current.open(99)
    result.current.close()
  })

  expect(setEpicPreviewId).toHaveBeenNthCalledWith(1, { epicPreviewId: 99 })
  expect(setEpicPreviewId).toHaveBeenNthCalledWith(2, { epicPreviewId: '' })
})
