'use client'
import { WalletProvider } from './context/WalletContext'
import { ThemeProvider } from './context/ThemeContext'
import { AosEffects } from './components/AosEffects'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AosEffects />
        {children}
      </WalletProvider>
    </ThemeProvider>
  )
}
