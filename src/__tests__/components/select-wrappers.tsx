import React from 'react'
import { render } from '@testing-library/react'
import { UserSelect } from 'components/user-select'
import { TaskTypeSelect } from 'components/task-type-select'
import { EpicSelect } from 'components/epic-select'

const mockIdSelect = jest.fn()
const mockUseUsers = jest.fn()
const mockUseTaskTypes = jest.fn()
const mockUseEpics = jest.fn()

jest.mock('components/id-select', () => ({
  IdSelect: (props: unknown) => {
    mockIdSelect(props)
    return <div data-testid="id-select-mock" />
  }
}))

jest.mock('utils/users', () => ({
  useUsers: () => mockUseUsers()
}))

jest.mock('utils/task-type', () => ({
  useTaskTypes: () => mockUseTaskTypes()
}))

jest.mock('utils/epic', () => ({
  useEpics: (...args: unknown[]) => mockUseEpics(...args)
}))

beforeEach(() => {
  mockIdSelect.mockClear()
})

test('UserSelect passes fetched users as options', () => {
  mockUseUsers.mockReturnValue({ data: [{ id: 1, name: 'Ada' }] })
  render(<UserSelect value={1} />)

  expect(mockIdSelect).toHaveBeenCalledWith(
    expect.objectContaining({
      value: 1,
      options: [{ id: 1, name: 'Ada' }]
    })
  )
})

test('TaskTypeSelect passes fetched task types as options', () => {
  mockUseTaskTypes.mockReturnValue({ data: [{ id: 2, name: '缺陷' }] })
  render(<TaskTypeSelect />)

  expect(mockIdSelect).toHaveBeenCalledWith(
    expect.objectContaining({
      options: [{ id: 2, name: '缺陷' }]
    })
  )
})

test('EpicSelect requests epics by projectId and passes options', () => {
  mockUseEpics.mockReturnValue({ data: [{ id: 9, name: 'P1' }] })
  render(<EpicSelect projectId={7} />)

  expect(mockUseEpics).toHaveBeenCalledWith({ projectId: 7 })
  expect(mockIdSelect).toHaveBeenCalledWith(
    expect.objectContaining({
      options: [{ id: 9, name: 'P1' }]
    })
  )
})
