import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'
import { AppProviders } from 'context'

test('renders login form', async () => {
  render(
    <AppProviders>
      <App />
    </AppProviders>
  )
  expect(await screen.findByText('请登录')).toBeInTheDocument()
})
