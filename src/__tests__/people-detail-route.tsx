import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from 'context'
import AuthenticatedApp from 'authenticated-app'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

jest.mock('context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: { name: 'Jack', token: 'token-123' },
    logout: jest.fn()
  })
}))

jest.mock('components/project-popover', () => ({
  ProjectPopover: () => <span>项目概览</span>
}))

jest.mock('screen/project-list/project-modal', () => ({
  ProjectModal: () => null
}))

jest.mock('screen/project-list/index', () => ({
  ProjectListScreen: () => <div>项目列表页</div>
}))

jest.mock('screen/project/index', () => ({
  ProjectScreen: () => <div>项目详情页</div>
}))

const apiUrl = process.env.REACT_APP_API_URL

const users = [
  { id: 1, name: 'Ada Lovelace', organization: 'Math Lab' },
  { id: 2, name: 'Grace Hopper', organization: 'Navy Research' }
]

const server = setupServer(
  rest.get(`${apiUrl}/users`, (req, res, ctx) => {
    const { id } = Object.fromEntries(req.url.searchParams)
    const result = id ? users.filter(user => user.id === Number(id)) : users
    return res(ctx.json(result))
  }),
  rest.get(`${apiUrl}/tasks`, (req, res, ctx) => res(ctx.json([]))),
  rest.get(`${apiUrl}/projects`, (req, res, ctx) => res(ctx.json([])))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderAuthenticatedApp = (route: string) => {
  window.history.pushState({}, '', route)

  return render(
    <AppProviders>
      <AuthenticatedApp />
    </AppProviders>
  )
}

test('renders people detail route shell', async () => {
  renderAuthenticatedApp('/people/1')

  expect(await screen.findByRole('heading', { name: '成员详情' })).toBeInTheDocument()
  expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  expect(screen.getByText('Math Lab')).toBeInTheDocument()
})

test('links from people list to detail route', async () => {
  renderAuthenticatedApp('/people')

  await userEvent.click(await screen.findByRole('link', { name: 'Ada Lovelace' }))

  expect(await screen.findByRole('heading', { name: '成员详情' })).toBeInTheDocument()
  expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
})
