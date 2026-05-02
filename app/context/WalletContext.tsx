'use client'

import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'

type EthereumRequestArguments = {
  method: string
  params?: unknown[]
}

type EthereumEvent = 'accountsChanged' | 'chainChanged'
type EthereumListener = (...args: unknown[]) => void

type EthereumProvider = {
  request: (args: EthereumRequestArguments) => Promise<unknown>
  on: (event: EthereumEvent, listener: EthereumListener) => void
  removeListener?: (event: EthereumEvent, listener: EthereumListener) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

type ProviderError = {
  code?: number
}

const isProviderError = (error: unknown): error is ProviderError => {
  return typeof error === 'object' && error !== null && 'code' in error
}

interface WalletContextType {
  address: string | null
  signer: JsonRpcSigner | null
  provider: BrowserProvider | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchToBaseSepolia: () => Promise<void>
  chainId: string | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  signer: null,
  provider: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
  switchToBaseSepolia: async () => {},
  chainId: null,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  const switchToBaseSepolia = useCallback(async () => {
    const ethereum = window.ethereum
    if (!ethereum) return

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      })
    } catch (error: unknown) {
      if (isProviderError(error) && error.code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BASE_SEPOLIA_CHAIN_ID,
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            },
          ],
        })
      }
    }
  }, [])

  const connect = useCallback(async () => {
    const ethereum = window.ethereum

    if (!ethereum) {
      alert('Please install MetaMask or a Web3 wallet')
      return
    }

    setIsConnecting(true)

    try {
      const nextProvider = new BrowserProvider(ethereum)
      await nextProvider.send('eth_requestAccounts', [])

      const nextSigner = await nextProvider.getSigner()
      const nextAddress = await nextSigner.getAddress()
      const network = await nextProvider.getNetwork()
      const nextChainId = `0x${network.chainId.toString(16)}`

      setProvider(nextProvider)
      setSigner(nextSigner)
      setAddress(nextAddress)
      setChainId(nextChainId)

      if (nextChainId !== BASE_SEPOLIA_CHAIN_ID) {
        await switchToBaseSepolia()
      }

      window.localStorage.setItem('stash_connected', 'true')
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [switchToBaseSepolia])

  const disconnect = useCallback(() => {
    setAddress(null)
    setSigner(null)
    setProvider(null)
    setChainId(null)
    window.localStorage.removeItem('stash_connected')
  }, [])

  useEffect(() => {
    const ethereum = window.ethereum

    const reconnectTimer = window.setTimeout(() => {
      if (window.localStorage.getItem('stash_connected') === 'true') {
        void connect()
      }
    }, 0)

    if (!ethereum) {
      return () => window.clearTimeout(reconnectTimer)
    }

    const handleAccountsChanged: EthereumListener = (accounts) => {
      if (!Array.isArray(accounts) || accounts.length === 0) {
        disconnect()
        return
      }
      void connect()
    }

    const handleChainChanged: EthereumListener = () => {
      void connect()
    }

    ethereum.on('accountsChanged', handleAccountsChanged)
    ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.clearTimeout(reconnectTimer)
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged)
      ethereum.removeListener?.('chainChanged', handleChainChanged)
    }
  }, [connect, disconnect])

  const value = useMemo(
    () => ({
      address,
      signer,
      provider,
      isConnected: Boolean(address),
      isConnecting,
      connect,
      disconnect,
      switchToBaseSepolia,
      chainId,
    }),
    [address, signer, provider, isConnecting, connect, disconnect, switchToBaseSepolia, chainId],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export const useWallet = () => useContext(WalletContext)
