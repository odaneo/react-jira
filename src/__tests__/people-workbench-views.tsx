import React from 'react'
import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { AppProviders } from 'context'
import { PeopleScreen } from 'screen/people'
import { MemoryRouter } from 'react-router-dom'

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

const renderPeopleScreen = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProviders>
        <PeopleScreen />
      </AppProviders>
    </MemoryRouter>
  )
}

test('管理者视角展示团队总览和风险模块', async () => {
  renderPeopleScreen('/people?view=workbench&role=manager')

  expect(await screen.findByRole('heading', { level: 1, name: '角色工作台' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 3, name: '团队负载概览' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 3, name: '风险成员' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 3, name: '组织覆盖' })).toBeInTheDocument()
  expect(screen.queryByText('当前聚焦成员')).not.toBeInTheDocument()
})

test('成员视角展示聚焦成员和协作模块', async () => {
  renderPeopleScreen('/people?view=workbench&role=member')

  expect(await screen.findByRole('heading', { level: 1, name: '角色工作台' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 3, name: '当前聚焦成员' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 2, name: '我负责的任务' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 2, name: '我汇报的任务' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { level: 2, name: '我参与的项目' })).toBeInTheDocument()
  expect(screen.queryByText('风险成员')).not.toBeInTheDocument()
})
