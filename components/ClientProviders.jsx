'use client'
import { AuthProvider } from './AuthProvider'

export function ClientProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
