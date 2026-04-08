import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PeopleDetailPanels } from 'screen/people/detail-panels'

const tasks = [
  { id: 1, name: 'Build filters', processorId: 1, reporterId: 2, projectId: 8 },
  { id: 2, name: 'Review styles', processorId: 2, reporterId: 1, projectId: 8 },
  { id: 3, name: 'Ship dashboard', processorId: 1, reporterId: 1, projectId: 9 }
]

const projects = [
  { id: 8, name: 'People Hub', personId: 1, organization: 'Design Ops' },
  { id: 9, name: 'Insights Board', personId: 2, organization: 'Data Guild' },
  { id: 10, name: 'Release Desk', personId: 1, organization: 'Delivery' }
]

test('renders collaboration panels grouped by the current user', () => {
  render(
    <MemoryRouter>
      <PeopleDetailPanels userId={1} tasks={tasks} projects={projects} />
    </MemoryRouter>
  )

  expect(screen.getByRole('heading', { name: '我负责的任务' })).toBeInTheDocument()
  expect(screen.getByText('Build filters')).toBeInTheDocument()
  expect(screen.getAllByText('Ship dashboard')).toHaveLength(2)

  expect(screen.getByRole('heading', { name: '我汇报的任务' })).toBeInTheDocument()
  expect(screen.getByText('Review styles')).toBeInTheDocument()

  expect(screen.getByRole('heading', { name: '我参与的项目' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'People Hub' })).toHaveAttribute('href', '/projects/8/kanban')
  expect(screen.getByRole('link', { name: 'Release Desk' })).toHaveAttribute('href', '/projects/10/kanban')
})
