'use client'

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { formatUnits, parseUnits } from 'ethers'
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import {
  FLEXIBLE_VAULT_ADDRESS,
  getFlexibleVaultContract,
  getUSDCContract,
} from '../../../lib/contract'

const transactions = [
  { type: 'Deposit', amount: '+5,000.00 USDC', account: '0x29fd...18ca', time: '2h ago', value: '+5,000.00', positive: true },
  { type: 'Withdraw', amount: '-1,200.00 USDC', account: '0x77cb...9f45', time: '1d ago', value: '-1,200.00', positive: false },
]

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'
const USDC_DECIMALS = 6

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
    return maybeError.shortMessage ?? maybeError.reason ?? maybeError.message ?? 'Transaction failed'
  }
  return 'Transaction failed'
}

export default function Flexible() {
  const { address, signer, isConnected, connect, chainId } = useWallet()
  const [activeForm, setActiveForm] = useState<'deposit' | 'withdraw'>('deposit')
  const [amountInput, setAmountInput] = useState('')
  const [walletBalance, setWalletBalance] = useState<bigint>(0n)
  const [vaultBalance, setVaultBalance] = useState<bigint>(0n)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionState, setTransactionState] = useState<TransactionState>({
    status: 'idle',
    message: '',
    txHash: null,
  })

  const amountValue = useMemo(() => Number(amountInput || 0), [amountInput])
  const projectedChange = useMemo(() => {
    const annualApy = 5.42
    const monthlyProjection = (amountValue * annualApy) / 12 / 100
    return monthlyProjection.toFixed(2)
  }, [amountValue])

  const isAmountValid = useMemo(() => {
    if (!amountInput) return false
    const amount = Number(amountInput)
    return Number.isFinite(amount) && amount > 0
  }, [amountInput])

  const refreshBalances = useCallback(async () => {
    if (!signer || !address) {
      setWalletBalance(0n)
      setVaultBalance(0n)
      return
    }

    try {
      const usdcContract = getUSDCContract(signer)
      const flexibleVaultContract = getFlexibleVaultContract(signer)

      const [wallet, shares] = await Promise.all([
        usdcContract.balanceOf(address) as Promise<bigint>,
        flexibleVaultContract.balanceOf(address) as Promise<bigint>,
      ])

      let assets = 0n
      if (shares > 0n) {
        assets = (await flexibleVaultContract.convertToAssets(shares)) as bigint
      }

      setWalletBalance(wallet)
      setVaultBalance(assets)
    } catch (error) {
      console.error('Failed to refresh flexible vault balances:', error)
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
          message: 'Connect your wallet before submitting a transaction.',
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
        message: activeForm === 'deposit' ? 'Preparing deposit...' : 'Preparing withdrawal...',
        txHash: null,
      })

      try {
        const amount = parseUnits(amountInput, USDC_DECIMALS)
        if (amount <= 0n) {
          throw new Error('Amount must be greater than zero.')
        }

        const flexibleVaultContract = getFlexibleVaultContract(signer)

        if (activeForm === 'deposit') {
          const usdcContract = getUSDCContract(signer)
          const allowance = (await usdcContract.allowance(address, FLEXIBLE_VAULT_ADDRESS)) as bigint

          if (allowance < amount) {
            setTransactionState({
              status: 'pending',
              message: 'Approving USDC for Flexible Vault...',
              txHash: null,
            })

            const approvalTx = await usdcContract.approve(FLEXIBLE_VAULT_ADDRESS, amount)
            await approvalTx.wait()
          }

          setTransactionState({
            status: 'pending',
            message: 'Submitting deposit transaction...',
            txHash: null,
          })

          const tx = await flexibleVaultContract.deposit(amount, address)
          const receipt = await tx.wait()

          setTransactionState({
            status: 'success',
            message: 'Deposit completed successfully.',
            txHash: receipt?.hash ?? tx.hash,
          })
        } else {
          setTransactionState({
            status: 'pending',
            message: 'Submitting withdrawal transaction...',
            txHash: null,
          })

          const tx = await flexibleVaultContract.withdraw(amount, address, address)
          const receipt = await tx.wait()

          setTransactionState({
            status: 'success',
            message: 'Withdrawal completed successfully.',
            txHash: receipt?.hash ?? tx.hash,
          })
        }

        setAmountInput('')
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
    [activeForm, address, amountInput, chainId, isAmountValid, isConnected, refreshBalances, signer],
  )

  return (
    <section className="dashboard-page surface">
      <header className="page-heading">
        <div>
          <h2 className="protocol-heading">Flexible Vault</h2>
          <p>Liquid USDC position with continuous accrual and immediate withdrawal access.</p>
        </div>
        <span className="protocol-pill">
          <TrendingUp size={14} />
          Current APY 8.42%
        </span>
      </header>

      <div className="metrics-grid">
        <article className="metric-card surface-soft">
          <span>Total Staked</span>
          <h3>$42,850.00</h3>
          <p>Current principal in strategy</p>
        </article>
        <article className="metric-card surface-soft">
          <span>Yield Earned</span>
          <h3>+$1,452.12</h3>
          <p>All-time compounded gains</p>
        </article>
        <article className="metric-card surface-soft">
          <span>Share Price</span>
          <h3>1.0840</h3>
          <p>USDC per vault share</p>
        </article>
      </div>

      <div className="two-col">
        <form className="panel surface-soft protocol-form" onSubmit={handleSubmit}>
          <div className="button-row">
            <button
              className={`protocol-button ${activeForm === 'deposit' ? 'protocol-button-primary' : 'protocol-button-secondary'}`}
              type="button"
              onClick={() => setActiveForm('deposit')}
            >
              Deposit
            </button>
            <button
              className={`protocol-button ${activeForm === 'withdraw' ? 'protocol-button-primary' : 'protocol-button-secondary'}`}
              type="button"
              onClick={() => setActiveForm('withdraw')}
            >
              Withdraw
            </button>
          </div>

          <div>
            <label htmlFor="flex-asset">Asset</label>
            <input id="flex-asset" value="USDC" readOnly />
          </div>

          <div>
            <label htmlFor="flex-amount">Amount</label>
            <div className="input-inline">
              <input
                id="flex-amount"
                type="number"
                min="0"
                step="0.000001"
                placeholder="0.00"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Wallet: {formatToken(walletBalance, USDC_DECIMALS)} USDC</p>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <div className="row-between">
              <span className="label">Estimated monthly yield</span>
              <span className="value mono">+{projectedChange} USDC</span>
            </div>
            <div className="row-between" style={{ marginTop: '0.55rem' }}>
              <span className="label">Vault contract</span>
              <span className="value mono">{FLEXIBLE_VAULT_ADDRESS}</span>
            </div>
          </div>

          {!isConnected ? (
            <button className="protocol-button protocol-button-primary" type="button" onClick={() => void connect()}>
              Connect Wallet
            </button>
          ) : (
            <button className="protocol-button protocol-button-primary" type="submit" disabled={isSubmitting || !isAmountValid}>
              {isSubmitting ? 'Submitting...' : `Confirm ${activeForm === 'deposit' ? 'Deposit' : 'Withdraw'}`}
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
        </form>

        <section className="panel surface-soft stack">
          <h3>Position Summary</h3>
          <p>Snapshot of your active liquid vault state.</p>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <span className="label">Your Total Balance</span>
            <h4 className="value" style={{ marginTop: '0.4rem' }}>{formatToken(vaultBalance, USDC_DECIMALS)} USDC</h4>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <span className="label">Vault Token Accrued</span>
            <h4 className="value" style={{ marginTop: '0.4rem' }}>+0.80 USDC</h4>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <span className="label">APR + Daily Compounding</span>
            <h4 className="value" style={{ marginTop: '0.4rem' }}>4.40%</h4>
          </div>
        </section>
      </div>

      <section className="panel surface-soft stack">
        <div className="row-between">
          <h3>Recent Transactions</h3>
          <span className="inline-note">Latest vault activity</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Account</th>
                <th>Time</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={`${tx.type}-${tx.time}-${tx.amount}`}>
                  <td>
                    {tx.type === 'Deposit' ? <ArrowDownLeft size={14} style={{ marginRight: '0.35rem' }} /> : <ArrowUpRight size={14} style={{ marginRight: '0.35rem' }} />}
                    {tx.type}
                  </td>
                  <td>{tx.amount}</td>
                  <td className="mono">{tx.account}</td>
                  <td>{tx.time}</td>
                  <td className={tx.positive ? 'status-positive' : ''}>{tx.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  )
}
