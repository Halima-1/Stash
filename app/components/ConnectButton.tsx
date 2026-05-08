'use client'
import { useWallet } from '../context/WalletContext'

export function ConnectButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet()
  const short = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
  const cls = compact ? 'compact' : ''

  if (isConnecting) return (
    <button className={`wallet-button ${cls}`}>
      <span className="wallet-spinner" />
      Connecting
    </button>
  )

  if (isConnected) return (
    <div className="wallet-group">
      <div className={`wallet-chip ${cls}`}>
        <span className="wallet-chip-dot" />
        {short}
      </div>
      <button className="wallet-disconnect" onClick={disconnect}>
        Disconnect
      </button>
    </div>
  )

  return (
    <button className={`wallet-button connect ${cls}`} onClick={connect}>
      Connect Wallet
    </button>
  )
}
