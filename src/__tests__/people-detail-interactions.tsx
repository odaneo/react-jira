import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('supports collapsing panels and filtering by project keyword', async () => {
  render(
    <MemoryRouter>
      <PeopleDetailPanels userId={1} tasks={tasks} projects={projects} />
    </MemoryRouter>
  )

  expect(screen.getByText('Build filters')).toBeInTheDocument()

  await userEvent.type(screen.getByPlaceholderText('按项目名称筛选'), 'People')

  expect(screen.getByText('Build filters')).toBeInTheDocument()
  expect(screen.queryByText('Ship dashboard')).not.toBeInTheDocument()

  expect(screen.getByRole('button', { name: '收起我负责的任务' })).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('button', { name: '收起我汇报的任务' })).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('button', { name: '收起我参与的项目' })).toHaveAttribute('aria-expanded', 'true')

  await userEvent.click(screen.getByRole('button', { name: '收起我负责的任务' }))

  expect(screen.queryByText('Build filters')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: '展开我负责的任务' })).toHaveAttribute('aria-expanded', 'false')
})
