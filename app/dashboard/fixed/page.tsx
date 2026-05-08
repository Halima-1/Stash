'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { formatUnits, parseUnits } from 'ethers'
import { AlertTriangle, LockKeyhole, ShieldCheck, Timer } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import {
  FIXED_VAULT_ADDRESS,
  getFixedVaultContract,
  getUSDCContract,
  USDC_DECIMALS,
} from '../../../lib/contract'

type DurationDays = 30 | 60 | 90
type LockDurationMap = Record<DurationDays, bigint>

const durationOptions: Array<{ days: DurationDays; apy: number }> = [
  { days: 30, apy: 4.5 },
  { days: 60, apy: 8.2 },
  { days: 90, apy: 12.5 },
]

const activePositions = [
  { amount: '5,000.00 USDC', term: '60 days', apy: '8.2%', maturity: '14d 22h remaining' },
  { amount: '12,500.00 USDC', term: '90 days', apy: '12.5%', maturity: '78d 04h remaining' },
]

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'

type TransactionState = {
  status: 'idle' | 'pending' | 'success' | 'error'
  message: string
  txHash: string | null
}

const DEFAULT_LOCK_SECONDS: LockDurationMap = {
  30: 30n * 24n * 60n * 60n,
  60: 60n * 24n * 60n * 60n,
  90: 90n * 24n * 60n * 60n,
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
    return maybeError.shortMessage ?? maybeError.reason ?? maybeError.message ?? 'Lock transaction failed'
  }
  return 'Lock transaction failed'
}

export default function Fixed() {
  const { address, signer, isConnected, connect, chainId } = useWallet()
  const [duration, setDuration] = useState<DurationDays>(90)
  const [amountInput, setAmountInput] = useState('')
  const [walletBalance, setWalletBalance] = useState<bigint>(0n)
  const [lockDurations, setLockDurations] = useState<LockDurationMap>(DEFAULT_LOCK_SECONDS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'idle',
    message: '',
    txHash: null,
  })
  const amountValue = useMemo(() => Number(amountInput || 0), [amountInput])

  const selectedApy = durationOptions.find((item) => item.days === duration)?.apy ?? 0

  const maturityDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + duration)

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [duration])

  const estimatedYield = useMemo(() => {
    const estimate = (amountValue * selectedApy * duration) / (365 * 100)
    return Number.isFinite(estimate) ? estimate.toFixed(2) : '0.00'
  }, [amountValue, duration, selectedApy])

  const isAmountValid = useMemo(() => {
    if (!amountInput) return false
    const amount = Number(amountInput)
    return Number.isFinite(amount) && amount > 0
  }, [amountInput])

  const refreshState = useCallback(async () => {
    if (!signer || !address) {
      setWalletBalance(0n)
      setLockDurations(DEFAULT_LOCK_SECONDS)
      return
    }

    try {
      const usdcContract = getUSDCContract(signer)
      const fixedVaultContract = getFixedVaultContract(signer)
      const [wallet, lock30, lock60, lock90] = await Promise.all([
        usdcContract.balanceOf(address) as Promise<bigint>,
        fixedVaultContract.LOCK_30_DAYS() as Promise<bigint>,
        fixedVaultContract.LOCK_60_DAYS() as Promise<bigint>,
        fixedVaultContract.LOCK_90_DAYS() as Promise<bigint>,
      ])

      setWalletBalance(wallet)
      setLockDurations({
        30: lock30,
        60: lock60,
        90: lock90,
      })
    } catch (error) {
      console.error('Failed to refresh fixed vault state:', error)
    }
  }, [address, signer])

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshState()
    }, 0)

    return () => {
      window.clearTimeout(refreshTimer)
    }
  }, [refreshState])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!isConnected || !signer || !address) {
        setTransactionState({
          status: 'error',
          message: 'Connect your wallet before locking funds.',
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

      if (!isAmountValid) {
        setTransactionState({
          status: 'error',
          message: 'Enter a valid USDC amount.',
          txHash: null,
        })
        return
      }

      setIsSubmitting(true)
      setTransactionState({
        status: 'pending',
        message: 'Preparing lock deposit...',
        txHash: null,
      })

      try {
        const amount = parseUnits(amountInput, USDC_DECIMALS)
        if (amount <= 0n) {
          throw new Error('Amount must be greater than zero.')
        }

        const fixedVaultContract = getFixedVaultContract(signer)
        const usdcContract = getUSDCContract(signer)
        const lockSeconds = lockDurations[duration] ?? DEFAULT_LOCK_SECONDS[duration]

        const allowance = (await usdcContract.allowance(address, FIXED_VAULT_ADDRESS)) as bigint
        if (allowance < amount) {
          setTransactionState({
            status: 'pending',
            message: 'Approving USDC for Fixed Vault...',
            txHash: null,
          })

          const approvalTx = await usdcContract.approve(FIXED_VAULT_ADDRESS, amount)
          await approvalTx.wait()
        }

        setTransactionState({
          status: 'pending',
          message: 'Submitting lock transaction...',
          txHash: null,
        })

        const tx = await fixedVaultContract.deposit(amount, lockSeconds)
        const receipt = await tx.wait()

        setTransactionState({
          status: 'success',
          message: 'USDC locked successfully.',
          txHash: receipt?.hash ?? tx.hash,
        })
        setAmountInput('')
        await refreshState()
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
    [address, amountInput, chainId, duration, isAmountValid, isConnected, lockDurations, refreshState, signer],
  )

  return (
    <section className="dashboard-page surface">
      <header className="page-heading">
        <div>
          <h2 className="protocol-heading">Fixed Vault</h2>
          <p>Lock USDC in defined terms for premium fixed-yield execution.</p>
        </div>
        <span className="protocol-pill">
          <ShieldCheck size={14} />
          On-chain maturity control
        </span>
      </header>

      <div className="metrics-grid">
        <article className="metric-card surface-soft">
          <span>Maximum APY</span>
          <h3>12.50%</h3>
          <p>90-day lockup tier</p>
        </article>
        <article className="metric-card surface-soft">
          <span>Total Vault Value</span>
          <h3>$4.2M</h3>
          <p>Across all fixed positions</p>
        </article>
        <article className="metric-card surface-soft">
          <span>Early Exit</span>
          <h3>Disabled</h3>
          <p>Enforced by contract constraints</p>
        </article>
      </div>

      <div className="two-col">
        <form className="panel surface-soft protocol-form" onSubmit={handleSubmit}>
          <h3>Lock Position</h3>

          <div>
            <label htmlFor="fixed-amount">Amount to lock</label>
            <div className="input-inline">
              <input
                id="fixed-amount"
                type="number"
                min="0"
                step="0.000001"
                placeholder="0.00"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Wallet balance: {formatToken(walletBalance, USDC_DECIMALS)} USDC</p>
          </div>

          <div>
            <label>Duration</label>
            <div className="selector-grid">
              {durationOptions.map((option) => (
                <button
                  key={option.days}
                  type="button"
                  className={`selector-card ${duration === option.days ? 'active' : ''}`}
                  onClick={() => setDuration(option.days)}
                >
                  <h4>{option.days} Days</h4>
                  <p>{option.apy}% APY</p>
                </button>
              ))}
            </div>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <div className="row-between">
              <span className="label">Maturity date</span>
              <span className="value mono">{maturityDate}</span>
            </div>
            <div className="row-between" style={{ marginTop: '0.55rem' }}>
              <span className="label">Estimated yield</span>
              <span className="value mono">+{estimatedYield} USDC</span>
            </div>
            <div className="row-between" style={{ marginTop: '0.55rem' }}>
              <span className="label">Vault contract</span>
              <span className="value mono">{FIXED_VAULT_ADDRESS}</span>
            </div>
          </div>

          {!isConnected ? (
            <button className="protocol-button protocol-button-primary" type="button" onClick={() => void connect()}>
              Connect Wallet
            </button>
          ) : (
            <button className="protocol-button protocol-button-primary" type="submit" disabled={isSubmitting || !isAmountValid}>
              <LockKeyhole size={15} />
              {isSubmitting ? 'Submitting...' : 'Lock USDC'}
            </button>
          )}

          {transactionState.status !== 'idle' ? (
            <p
              className={transactionState.status === 'success' ? 'status-positive' : 'inline-note'}
              style={transactionState.status === 'error' ? { color: 'var(--color-danger)' } : undefined}
            >
              {transactionState.message}
            </p>
          ) : null}

          {transactionState.txHash ? (
            <a
              href={`https://sepolia.basescan.org/tx/${transactionState.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="inline-note mono"
            >
              View transaction: {transactionState.txHash}
            </a>
          ) : null}

          <div className="protocol-pill" style={{ borderRadius: 'var(--radius-sm)' }}>
            <AlertTriangle size={14} />
            No early withdrawal before maturity.
          </div>
        </form>

        <section className="panel surface-soft stack">
          <h3>Active Positions</h3>
          <p>Tracked fixed-term allocations and countdown to unlock.</p>

          {activePositions.map((position) => (
            <article key={`${position.amount}-${position.term}`} className="surface" style={{ padding: '0.8rem' }}>
              <div className="row-between">
                <span className="value mono">{position.amount}</span>
                <span className="protocol-pill">{position.apy} APY</span>
              </div>
              <p className="inline-note" style={{ marginTop: '0.4rem' }}>
                {position.term} term
              </p>
              <p style={{ marginTop: '0.5rem' }} className="status-positive">
                <Timer size={14} style={{ marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
                {position.maturity}
              </p>
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}
