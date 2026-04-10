import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { AppProviders } from 'context'
import { PeopleScreen } from 'screen/people'
import { MemoryRouter, useLocation } from 'react-router-dom'

jest.mock('context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: { name: 'Jack', token: 'token-123' },
    logout: jest.fn()
  })
}))

const apiUrl = process.env.REACT_APP_API_URL

const users = [
  { id: 1, name: 'Ada Lovelace', organization: '平台研发' },
  { id: 2, name: 'Grace Hopper', organization: '平台研发' },
  { id: 3, name: 'Linus Torvalds', organization: '基础架构' }
]

const tasks = [
  { id: 1, name: '搭建筛选器', processorId: 1, reporterId: 2, projectId: 8, created: 1710000000000 },
  { id: 2, name: '沉淀样式规范', processorId: 2, reporterId: 1, projectId: 8, created: 1710500000000 },
  { id: 3, name: '分析风险队列', processorId: 1, reporterId: 3, projectId: 9, created: 1711000000000 }
]

const projects = [
  { id: 8, name: '人员中心', personId: 1, organization: '平台研发' },
  { id: 9, name: '风险看板', personId: 3, organization: '基础架构' }
]

const server = setupServer(
  rest.get(`${apiUrl}/users`, (req, res, ctx) => res(ctx.json(users))),
  rest.get(`${apiUrl}/tasks`, (req, res, ctx) => res(ctx.json(tasks))),
  rest.get(`${apiUrl}/projects`, (req, res, ctx) => res(ctx.json(projects)))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location-search">{location.search}</div>
}

const renderPeopleScreen = (route = '/people?view=insights') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProviders>
        <>
          <PeopleScreen />
          <LocationProbe />
        </>
      </AppProviders>
    </MemoryRouter>
  )
}

test('renders insights view with filters and KPI cards', async () => {
  renderPeopleScreen()

  expect(await screen.findByRole('heading', { level: 1, name: '人员分析' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '成员列表' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '分析洞察' })).toBeInTheDocument()
  expect(screen.getByText('时间范围')).toBeInTheDocument()
  expect(screen.getByText('项目范围')).toBeInTheDocument()
  expect(screen.getByText('组织分组')).toBeInTheDocument()
  expect(screen.getByText('任务负载')).toBeInTheDocument()
  expect(screen.getByText('协作进度')).toBeInTheDocument()
  expect(screen.getAllByText('风险成员').length).toBeGreaterThan(0)
  expect(screen.getByText('覆盖项目')).toBeInTheDocument()
})

test('switches between member list and insights view through url state', async () => {
  renderPeopleScreen('/people')

  expect(await screen.findByRole('heading', { level: 1, name: '人员中心' })).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: '分析洞察' }))

  await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('view=insights'))
  expect(await screen.findByRole('heading', { level: 1, name: '人员分析' })).toBeInTheDocument()
})
