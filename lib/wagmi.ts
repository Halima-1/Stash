
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Stash',
  projectId: 'ac402aef018c13ea9bc61567ff354979',
  chains: [baseSepolia],
  wallets: [
    {
      groupName: 'Wallets',
      wallets: [injectedWallet],
    },
  ],
  ssr: false,
})
