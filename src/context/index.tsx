import { ReactNode } from 'react'
import { AuthProvider } from './auth-context'
import { QueryClientProvider, QueryClient } from 'react-query'

export const AppProviders = ({ children }: { children: ReactNode }): JSX.Element => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
