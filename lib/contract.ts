import { Contract, JsonRpcSigner } from 'ethers'
import FixedVaultABI from './abi/FixedVault.json'
import FlexibleVaultABI from './abi/FlexibleVault.json'
import P2PTransferABI from './abi/P2PTransfer.json'

export const USDC_ADDRESS      = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
export const FIXED_VAULT_ADDRESS    = '0xAc49f293D7b98119E45eCC4Fd528D480dea9F4A8'
export const FLEXIBLE_VAULT_ADDRESS = '0x56fB93B19bBaF700A4a9214388d664d1A25A699E'
export const P2P_TRANSFER_ADDRESS   = '0x0C8d08a5d2e107b6f0F09025230C8458376062e7'

export const USDC_ABI = [
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

export const getFixedVaultContract    = (signer: JsonRpcSigner) => new Contract(FIXED_VAULT_ADDRESS,    FixedVaultABI.abi,    signer)
export const getFlexibleVaultContract = (signer: JsonRpcSigner) => new Contract(FLEXIBLE_VAULT_ADDRESS, FlexibleVaultABI.abi, signer)
export const getP2PTransferContract   = (signer: JsonRpcSigner) => new Contract(P2P_TRANSFER_ADDRESS,   P2PTransferABI.abi,   signer)
export const getUSDCContract          = (signer: JsonRpcSigner) => new Contract(USDC_ADDRESS,           USDC_ABI,             signer)
