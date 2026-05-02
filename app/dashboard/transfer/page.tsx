'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'

type TransferForm = {
  recipient: string
  amount: string
}

const recipients = [
  { name: 'Treasury Ops', wallet: '0x2331...4re8' },
  { name: 'Payroll Reserve', wallet: '0x2ac4...85b1' },
  { name: 'Vendor Escrow', wallet: '0x8f3d...19aa' },
]

export default function Transfer() {
  const [formData, setFormData] = useState<TransferForm>({
    recipient: '',
    amount: '',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formData)
  }

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
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <span>USDC</span>
            </div>
            <p className="inline-note">Available balance: 535,000.00 USDC</p>
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

          <button className="protocol-button protocol-button-primary" type="submit" disabled={parsedAmount <= 0}>
            <Send size={15} />
            Confirm transfer
          </button>
        </form>

        <section className="panel surface-soft stack">
          <h3>Transfer Confirmation</h3>
          <p>Example receipt output after transaction settlement.</p>

          <article className="surface" style={{ padding: '0.9rem' }}>
            <p className="status-positive" style={{ fontWeight: 700 }}>
              <CheckCircle2 size={15} style={{ marginRight: '0.35rem', verticalAlign: 'text-bottom' }} />
              Transaction finalized
            </p>
            <p className="inline-note" style={{ marginTop: '0.45rem' }}>
              Your 10,000.00 USDC transfer has been settled on Base and indexed for explorer lookup.
            </p>
          </article>

          <div className="button-row">
            <button type="button" className="protocol-button protocol-button-secondary">View explorer</button>
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
