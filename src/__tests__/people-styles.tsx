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

const server = setupServer(
  rest.get(`${apiUrl}/users`, (req, res, ctx) => {
    return res(ctx.json([]))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const renderPeopleScreen = (route = '/people') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProviders>
        <PeopleScreen />
      </AppProviders>
    </MemoryRouter>
  )
}

test('renders people UI surfaces and empty summary state', async () => {
  renderPeopleScreen()

  expect(await screen.findByText('暂无成员数据')).toBeInTheDocument()
  expect(screen.getByTestId('people-shell').className).toMatch(/people-shell/)
  expect(screen.getByTestId('people-hero').className).toMatch(/people-hero/)
  expect(screen.getByTestId('people-toolbar').className).toMatch(/people-toolbar/)
  expect(screen.getByText('0 位成员')).toBeInTheDocument()
})
