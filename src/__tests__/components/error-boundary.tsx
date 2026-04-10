import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from 'components/error-boundary'

const Thrower = () => {
  throw new Error('boom')
}

test('ErrorBoundary renders fallback when child throws', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <ErrorBoundary fallbackRender={({ error }) => <div data-testid="fallback">{error?.message}</div>}>
      <Thrower />
    </ErrorBoundary>
  )

  expect(screen.getByTestId('fallback')).toHaveTextContent('boom')
  spy.mockRestore()
})
