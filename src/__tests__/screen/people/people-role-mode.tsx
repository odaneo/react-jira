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
  { id: 1, name: 'Ada Lovelace', organization: '数学研究所' },
  { id: 2, name: 'Grace Hopper', organization: '数学研究所' },
  { id: 3, name: 'Linus Torvalds', organization: '平台工程组' }
]

const tasks = [
  { id: 1, name: '补齐筛选表单', processorId: 1, reporterId: 2, projectId: 8, created: 1710000000000 },
  { id: 2, name: '修复看板拖拽', processorId: 2, reporterId: 1, projectId: 8, created: 1710500000000 },
  { id: 3, name: '清理异常告警', processorId: 1, reporterId: 3, projectId: 9, created: 1711000000000 }
]

const projects = [
  { id: 8, name: '人员中心', personId: 1, organization: '数学研究所' },
  { id: 9, name: '交付驾驶舱', personId: 3, organization: '平台工程组' }
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

const renderPeopleScreen = (route = '/people?view=workbench') => {
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

test('默认进入管理者视角并同步 role 参数', async () => {
  renderPeopleScreen()

  expect(await screen.findByRole('heading', { level: 1, name: '角色工作台' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '管理者视角' })).toHaveAttribute('data-active', 'true')
  expect(screen.getByTestId('location-search')).toHaveTextContent('view=workbench')

  await userEvent.click(screen.getByRole('button', { name: '成员视角' }))

  await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('role=member'))
  expect(screen.getByRole('button', { name: '成员视角' })).toHaveAttribute('data-active', 'true')

  await userEvent.click(screen.getByRole('button', { name: '管理者视角' }))

  await waitFor(() => expect(screen.getByTestId('location-search')).not.toHaveTextContent('role=member'))
})

test('切换角色时保留当前筛选条件', async () => {
  renderPeopleScreen('/people?view=workbench&range=30d&projectId=8&group=数学研究所')

  expect(await screen.findByRole('heading', { level: 1, name: '角色工作台' })).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: '成员视角' }))

  await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('role=member'))
  expect(screen.getByTestId('location-search')).toHaveTextContent('range=30d')
  expect(screen.getByTestId('location-search')).toHaveTextContent('projectId=8')
  expect(screen.getByTestId('location-search')).toHaveTextContent('group=%E6%95%B0%E5%AD%A6%E7%A0%94%E7%A9%B6%E6%89%80')
})
