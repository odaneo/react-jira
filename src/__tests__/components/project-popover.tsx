import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { ProjectPopover } from 'components/project-popover'

const mockUseProjects = jest.fn()
const mockUseProjectModal = jest.fn()

jest.mock('utils/project', () => ({
  useProjects: () => mockUseProjects()
}))

jest.mock('screen/project-list/util', () => ({
  useProjectModal: () => mockUseProjectModal()
}))

jest.mock('components/libs', () => ({
  ButtonNoPadding: ({ onClick, children }: any) => (
    <button data-testid="open-project-modal" onClick={onClick}>
      {children}
    </button>
  )
}))

jest.mock('antd', () => {
  const ListItem = ({ children }: any) => <li>{children}</li>
  ListItem.Meta = ({ title }: any) => <span>{title}</span>
  const List = ({ children }: any) => <ul>{children}</ul>
  List.Item = ListItem
  return {
    Divider: () => <hr />,
    Typography: { Text: ({ children }: any) => <span>{children}</span> },
    List,
    Popover: ({ children, content, onVisibleChange }: any) => (
      <div>
        <button data-testid="popover-visible" onClick={() => onVisibleChange?.(true)}>
          visible
        </button>
        <div data-testid="popover-trigger">{children}</div>
        <div data-testid="popover-content">{content}</div>
      </div>
    )
  }
})

test('ProjectPopover shows pinned projects and triggers refetch/open', () => {
  const refetch = jest.fn()
  const open = jest.fn()
  mockUseProjects.mockReturnValue({
    data: [
      { id: 1, name: 'P1', pin: true },
      { id: 2, name: 'P2', pin: false },
      { id: 3, name: 'P3', pin: true }
    ],
    refetch
  })
  mockUseProjectModal.mockReturnValue({ open })

  render(<ProjectPopover />)

  expect(screen.getByText('P1')).toBeInTheDocument()
  expect(screen.getByText('P3')).toBeInTheDocument()
  expect(screen.queryByText('P2')).not.toBeInTheDocument()

  fireEvent.click(screen.getByTestId('popover-visible'))
  fireEvent.click(screen.getByTestId('open-project-modal'))

  expect(refetch).toHaveBeenCalled()
  expect(open).toHaveBeenCalled()
})
