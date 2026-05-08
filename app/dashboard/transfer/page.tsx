'use client'

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { formatUnits, isAddress, parseUnits } from 'ethers'
import { CheckCircle2, Send } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import {
  getP2PTransferContract,
  getUSDCContract,
  P2P_TRANSFER_ADDRESS,
  USDC_DECIMALS,
} from '../../../lib/contract'

type TransferForm = {
  recipient: string
  amount: string
  memo: string
}

const recipients = [
  { name: 'Treasury Ops', wallet: '0x2331...4re8' },
  { name: 'Payroll Reserve', wallet: '0x2ac4...85b1' },
  { name: 'Vendor Escrow', wallet: '0x8f3d...19aa' },
]

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'

type TransactionState = {
  status: 'idle' | 'pending' | 'success' | 'error'
  message: string
  txHash: string | null
}

const formatToken = (value: bigint, decimals: number) => {
  const parsed = Number(formatUnits(value, decimals))
  if (!Number.isFinite(parsed)) return '0.00'
  return parsed.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { shortMessage?: string; reason?: string; message?: string }
    return maybeError.shortMessage ?? maybeError.reason ?? maybeError.message ?? 'Transfer failed'
  }
  return 'Transfer failed'
}

export default function Transfer() {
  const { address, signer, isConnected, connect, chainId } = useWallet()
  const [formData, setFormData] = useState<TransferForm>({
    recipient: '',
    amount: '',
    memo: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletBalance, setWalletBalance] = useState<bigint>(0n)
  const [maxMemoBytes, setMaxMemoBytes] = useState<bigint>(0n)
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'idle',
    message: '',
    txHash: null,
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const parsedAmount = useMemo(() => Number(formData.amount || 0), [formData.amount])
  const networkFee = 0
  const total = Number.isFinite(parsedAmount) ? parsedAmount + networkFee : 0
  const memoLength = useMemo(() => new TextEncoder().encode(formData.memo).length, [formData.memo])
  const isMemoValid = useMemo(() => {
    if (maxMemoBytes === 0n) return true
    return BigInt(memoLength) <= maxMemoBytes
  }, [maxMemoBytes, memoLength])

  const refreshBalances = useCallback(async () => {
    if (!signer || !address) {
      setWalletBalance(0n)
      setMaxMemoBytes(0n)
      return
    }

    try {
      const usdcContract = getUSDCContract(signer)
      const transferContract = getP2PTransferContract(signer)
      const [wallet, memoMax] = await Promise.all([
        usdcContract.balanceOf(address) as Promise<bigint>,
        transferContract.MAX_MEMO_BYTES() as Promise<bigint>,
      ])

      setWalletBalance(wallet)
      setMaxMemoBytes(memoMax)
    } catch (error) {
      console.error('Failed to refresh transfer balances:', error)
    }
  }, [address, signer])

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshBalances()
    }, 0)

    return () => {
      window.clearTimeout(refreshTimer)
    }
  }, [refreshBalances])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!isConnected || !signer || !address) {
        setTransactionState({
          status: 'error',
          message: 'Connect your wallet before sending a transfer.',
          txHash: null,
        })
        return
      }

      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        setTransactionState({
          status: 'error',
          message: 'Switch to Base Sepolia and try again.',
          txHash: null,
        })
        return
      }

      if (!isAddress(formData.recipient.trim())) {
        setTransactionState({
          status: 'error',
          message: 'Enter a valid recipient wallet address.',
          txHash: null,
        })
        return
      }

      if (!isMemoValid) {
        setTransactionState({
          status: 'error',
          message: `Memo exceeds contract limit (${maxMemoBytes.toString()} bytes).`,
          txHash: null,
        })
        return
      }

      setIsSubmitting(true)
      setTransactionState({
        status: 'pending',
        message: 'Preparing transfer...',
        txHash: null,
      })

      try {
        const amount = parseUnits(formData.amount, USDC_DECIMALS)
        if (amount <= 0n) {
          throw new Error('Amount must be greater than zero.')
        }

        const usdcContract = getUSDCContract(signer)
        const transferContract = getP2PTransferContract(signer)

        const allowance = (await usdcContract.allowance(address, P2P_TRANSFER_ADDRESS)) as bigint
        if (allowance < amount) {
          setTransactionState({
            status: 'pending',
            message: 'Approving USDC for transfer contract...',
            txHash: null,
          })

          const approvalTx = await usdcContract.approve(P2P_TRANSFER_ADDRESS, amount)
          await approvalTx.wait()
        }

        setTransactionState({
          status: 'pending',
          message: 'Submitting transfer transaction...',
          txHash: null,
        })

        const tx = await transferContract.send(formData.recipient.trim(), amount, formData.memo.trim())
        const receipt = await tx.wait()

        setTransactionState({
          status: 'success',
          message: 'Transfer finalized successfully.',
          txHash: receipt?.hash ?? tx.hash,
        })
        setFormData({
          recipient: '',
          amount: '',
          memo: '',
        })
        await refreshBalances()
      } catch (error) {
        setTransactionState({
          status: 'error',
          message: getErrorMessage(error),
          txHash: null,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    [address, chainId, formData, isConnected, isMemoValid, maxMemoBytes, refreshBalances, signer],
  )

  return (
    <section className="dashboard-page surface">
      <header className="page-heading">
        <div>
          <h2 className="protocol-heading">P2P Transfer</h2>
          <p>Send USDC directly to any Base wallet with on-chain finality.</p>
        </div>
        <span className="protocol-pill">
          <Send size={14} />
          Protocol fee: 0 USDC
        </span>
      </header>

      <div className="two-col">
        <form className="panel surface-soft protocol-form" onSubmit={handleSubmit}>
          <h3>New Transfer</h3>

          <div>
            <label htmlFor="recipient">Recipient wallet</label>
            <input
              id="recipient"
              name="recipient"
              type="text"
              placeholder="0x..."
              value={formData.recipient}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="amount">Amount</label>
            <div className="input-inline">
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.000001"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Available balance: {formatToken(walletBalance, USDC_DECIMALS)} USDC</p>
          </div>

          <div>
            <label htmlFor="memo">Memo (optional)</label>
            <input
              id="memo"
              name="memo"
              type="text"
              placeholder="Purpose / reference"
              value={formData.memo}
              onChange={handleChange}
            />
            <p className="inline-note">
              {memoLength} bytes used{maxMemoBytes > 0n ? ` / ${maxMemoBytes.toString()} max` : ''}
            </p>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <div className="row-between">
              <span className="label">Network fee</span>
              <span className="value mono">{networkFee.toFixed(2)} USDC</span>
            </div>
            <div className="row-between" style={{ marginTop: '0.55rem' }}>
              <span className="label">Total to send</span>
              <span className="value mono">{total.toFixed(2)} USDC</span>
            </div>
          </div>

          {!isConnected ? (
            <button className="protocol-button protocol-button-primary" type="button" onClick={() => void connect()}>
              Connect Wallet
            </button>
          ) : (
            <button
              className="protocol-button protocol-button-primary"
              type="submit"
              disabled={isSubmitting || parsedAmount <= 0 || !isMemoValid}
            >
              <Send size={15} />
              {isSubmitting ? 'Submitting...' : 'Confirm transfer'}
            </button>
          )}
        </form>

        <section className="panel surface-soft stack">
          <h3>Transfer Confirmation</h3>
          <p>Latest transaction status from your wallet flow.</p>

          <article className="surface" style={{ padding: '0.9rem' }}>
            <p
              className={transactionState.status === 'success' ? 'status-positive' : 'inline-note'}
              style={{
                fontWeight: 700,
                color: transactionState.status === 'error' ? 'var(--color-danger)' : undefined,
              }}
            >
              <CheckCircle2 size={15} style={{ marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
              {transactionState.status === 'idle' ? 'Awaiting transfer' : transactionState.message}
            </p>
            <p className="inline-note" style={{ marginTop: '0.45rem' }}>
              {transactionState.txHash
                ? `Tx hash: ${transactionState.txHash}`
                : 'Submit a transfer to display the finalized receipt details here.'}
            </p>
          </article>

          <div className="button-row">
            <a
              href={transactionState.txHash ? `https://sepolia.basescan.org/tx/${transactionState.txHash}` : '#'}
              target="_blank"
              rel="noreferrer"
              className="protocol-button protocol-button-secondary"
              style={!transactionState.txHash ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
            >
              View explorer
            </a>
            <button type="button" className="protocol-button protocol-button-secondary">Download receipt</button>
          </div>

          <div className="surface" style={{ padding: '0.9rem' }}>
            <h4 style={{ marginBottom: '0.55rem' }}>Recent recipients</h4>
            <ul className="list-lines">
              {recipients.map((recipient) => (
                <li key={recipient.wallet}>
                  <strong>{recipient.name}</strong>
                  <p className="inline-note mono" style={{ marginTop: '0.22rem' }}>{recipient.wallet}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </section>
  )
}
