'use client'

import { useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react'

const transactions = [
  { type: 'Deposit', amount: '+5,000.00 USDC', account: '0x29fd...18ca', time: '2h ago', value: '+5,000.00', positive: true },
  { type: 'Withdraw', amount: '-1,200.00 USDC', account: '0x77cb...9f45', time: '1d ago', value: '-1,200.00', positive: false },
]

export default function Flexible() {
  const [activeForm, setActiveForm] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState(0)

  const projectedChange = useMemo(() => {
    const annualApy = 5.42
    const monthlyProjection = (amount * annualApy) / 12 / 100
    return monthlyProjection.toFixed(2)
  }, [amount])

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
        <form className="panel surface-soft protocol-form" onSubmit={(event) => event.preventDefault()}>
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
                placeholder="0.00"
                value={amount || ''}
                onChange={(event) => setAmount(Number(event.target.value))}
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Wallet: 42,450.00 USDC</p>
          </div>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <div className="row-between">
              <span className="label">Estimated monthly yield</span>
              <span className="value mono">+{projectedChange} USDC</span>
            </div>
            <div className="row-between" style={{ marginTop: '0.55rem' }}>
              <span className="label">Vault contract</span>
              <span className="value mono">0x8a4c...e220</span>
            </div>
          </div>

          <button className="protocol-button protocol-button-primary" type="submit" disabled={amount <= 0}>
            Confirm {activeForm === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </form>

        <section className="panel surface-soft stack">
          <h3>Position Summary</h3>
          <p>Snapshot of your active liquid vault state.</p>

          <div className="surface" style={{ padding: '0.8rem' }}>
            <span className="label">Your Total Balance</span>
            <h4 className="value" style={{ marginTop: '0.4rem' }}>5,250.32 USDC</h4>
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
