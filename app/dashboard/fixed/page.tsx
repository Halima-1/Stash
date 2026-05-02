'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, LockKeyhole, ShieldCheck, Timer } from 'lucide-react'

const durationOptions = [
  { days: 30, apy: 4.5 },
  { days: 60, apy: 8.2 },
  { days: 90, apy: 12.5 },
]

const activePositions = [
  { amount: '5,000.00 USDC', term: '60 days', apy: '8.2%', maturity: '14d 22h remaining' },
  { amount: '12,500.00 USDC', term: '90 days', apy: '12.5%', maturity: '78d 04h remaining' },
]

export default function Fixed() {
  const [duration, setDuration] = useState(90)
  const [amount, setAmount] = useState(0)

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
    const estimate = (amount * selectedApy * duration) / (365 * 100)
    return Number.isFinite(estimate) ? estimate.toFixed(2) : '0.00'
  }, [amount, duration, selectedApy])

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
        <form className="panel surface-soft protocol-form" onSubmit={(event) => event.preventDefault()}>
          <h3>Lock Position</h3>

          <div>
            <label htmlFor="fixed-amount">Amount to lock</label>
            <div className="input-inline">
              <input
                id="fixed-amount"
                type="number"
                min="0"
                placeholder="0.00"
                value={amount || ''}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Wallet balance: 12,450.00 USDC</p>
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
          </div>

          <button className="protocol-button protocol-button-primary" type="submit" disabled={amount <= 0}>
            <LockKeyhole size={15} />
            Lock USDC
          </button>

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
