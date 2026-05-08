import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const products = [
  {
    id: 'fixed-vault',
    label: 'Fixed Vault',
    description: 'Term-based yield structure with maturity-locked principal and transparent return schedule.',
  },
  {
    id: 'flexible-vault',
    label: 'Flexible Vault',
    description: 'Continuous compounding strategy for liquid treasury balances with instant withdrawal.',
  },
  {
    id: 'p2p-transfer',
    label: 'P2P Transfer',
    description: 'Zero-fee USDC settlement rail for wallet-to-wallet movement across Base.',
  },
  {
    id: 'risk-monitoring',
    label: 'Risk Monitoring',
    description: 'Operational dashboards for vault utilization, transaction flow, and control posture.',
  },
]

export default function ProductIndexPage() {
  return (
    <main className="product-page">
      <span className="protocol-pill">Product Registry</span>
      <h1 className="protocol-heading" style={{ marginTop: '1rem', fontSize: 'clamp(2rem, 5vw, 3.4rem)' }}>
        Protocol capabilities built for stablecoin operations.
      </h1>
      <p style={{ marginTop: '0.85rem', color: 'var(--color-text-soft)', maxWidth: '44rem', lineHeight: 1.7 }}>
        Explore each module to understand how Stash manages savings, settlement, and capital efficiency.
      </p>

      <div className="product-grid">
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} className="surface-soft product-card">
            <span className="protocol-pill">{product.label}</span>
            <h3>{product.label}</h3>
            <p>{product.description}</p>
            <span style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-accent-strong)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              View details
              <ArrowRight size={13} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
