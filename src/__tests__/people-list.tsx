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
  { id: 1, name: 'Ada Lovelace', organization: 'Math Lab' },
  { id: 2, name: 'Grace Hopper', organization: 'Navy Research' },
  { id: 3, name: 'Linus Torvalds', organization: 'Kernel Group' }
]

const server = setupServer(
  rest.get(`${apiUrl}/users`, (req, res, ctx) => {
    const { name = '', organization = '' } = Object.fromEntries(req.url.searchParams)
    const result = users.filter(user => {
      return user.name.includes(String(name)) && user.organization.includes(String(organization))
    })

    return res(ctx.json(result))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const LocationProbe = () => {
  const location = useLocation()
  return <div data-testid="location-search">{location.search}</div>
}

const renderPeopleScreen = (route = '/people') => {
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

test('renders user list from query params', async () => {
  renderPeopleScreen('/people?name=Ada')

  expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()
  expect(screen.queryByText('Grace Hopper')).not.toBeInTheDocument()
})

test('updates search params and filters users by name', async () => {
  renderPeopleScreen('/people')

  expect(await screen.findByText('Ada Lovelace')).toBeInTheDocument()

  await userEvent.type(screen.getByPlaceholderText(/search by name/i), 'Grace')

  await waitFor(() => expect(screen.getByTestId('location-search')).toHaveTextContent('name=Grace'))
  expect(await screen.findByText('Grace Hopper')).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument())
})
