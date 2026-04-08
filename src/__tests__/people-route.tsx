import React from 'react'
import { render, screen } from '@testing-library/react'
import AuthenticatedApp from 'authenticated-app'
import { AppProviders } from 'context'

jest.mock('context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: { name: 'Jack' },
    logout: jest.fn()
  })
}))

jest.mock('components/project-popover', () => ({
  ProjectPopover: () => <span>Projects</span>
}))

jest.mock('screen/project-list/project-modal', () => ({
  ProjectModal: () => null
}))

jest.mock('screen/project-list/index', () => ({
  ProjectListScreen: () => <div>Projects Page</div>
}))

jest.mock('screen/project/index', () => ({
  ProjectScreen: () => <div>Project Detail Page</div>
}))

const renderAuthenticatedApp = (route = '/projects') => {
  window.history.pushState({}, '', route)

  return render(
    <AppProviders>
      <AuthenticatedApp />
    </AppProviders>
  )
}

test('renders people route and header entry', () => {
  renderAuthenticatedApp('/people')

  expect(screen.getByRole('heading', { name: /people hub/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /people/i })).toBeInTheDocument()
})
