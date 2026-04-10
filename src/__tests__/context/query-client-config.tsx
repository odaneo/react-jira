import React from 'react'
import { render, screen } from '@testing-library/react'
import { useQueryClient } from 'react-query'
import { AppProviders } from 'context'

jest.mock('context/auth-context', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

const Probe = () => {
  const queryClient = useQueryClient()
  const refetchOnWindowFocus = queryClient.getDefaultOptions().queries?.refetchOnWindowFocus
  return <div>{String(refetchOnWindowFocus)}</div>
}

test('AppProviders 关闭窗口聚焦自动 refetch', () => {
  render(
    <AppProviders>
      <Probe />
    </AppProviders>
  )
  expect(screen.getByText('false')).toBeInTheDocument()
})
