import React from 'react'
import { render, screen } from '@testing-library/react'
import { ErrorBox, FullPageErrorFallback, FullPageLoading } from 'components/libs'

jest.mock('antd', () => ({
  Spin: () => <div data-testid="spin">loading</div>,
  Typography: {
    Text: ({ children }: any) => <span data-testid="error-text">{children}</span>
  },
  Button: ({ children }: any) => <button>{children}</button>
}))

test('ErrorBox renders error message for Error instance', () => {
  render(<ErrorBox error={new Error('failed')} />)
  expect(screen.getByTestId('error-text')).toHaveTextContent('failed')
})

test('ErrorBox renders null for non-error value', () => {
  const { container } = render(<ErrorBox error={'plain'} />)
  expect(container).toBeEmptyDOMElement()
})

test('FullPageLoading and FullPageErrorFallback render expected content', () => {
  const { rerender } = render(<FullPageLoading />)
  expect(screen.getByTestId('spin')).toBeInTheDocument()

  rerender(<FullPageErrorFallback error={new Error('oops')} />)
  expect(screen.getByTestId('error-text')).toHaveTextContent('oops')
})
