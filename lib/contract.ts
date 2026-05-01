
import FixedVaultABI from './abi/FixedVault.json'
import FlexibleVaultABI from './abi/FlexibleVault.json'
import P2PTransferABI from './abi/P2PTransfer.json'

export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as `0x${string}`
export const FIXED_VAULT_ADDRESS = '0xAc49f293D7b98119E45eCC4Fd528D480dea9F4A8' as `0x${string}`
export const FLEXIBLE_VAULT_ADDRESS = '0x56fB93B19bBaF700A4a9214388d664d1A25A699E' as `0x${string}`
export const P2P_TRANSFER_ADDRESS = '0x0C8d08a5d2e107b6f0F09025230C8458376062e7' as `0x${string}`

export const FIXED_VAULT_ABI = FixedVaultABI.abi
export const FLEXIBLE_VAULT_ABI = FlexibleVaultABI.abi
export const P2P_TRANSFER_ABI = P2PTransferABI.abi

export const USDC_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const
