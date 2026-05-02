import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type ProductPageProps = {
  params: Promise<{
    id: string
  }>
}

const productMap: Record<string, { title: string; summary: string; bullets: string[] }> = {
  'fixed-vault': {
    title: 'Fixed Vault',
    summary: 'Contract-enforced lock periods designed for predictable, term-based yield.',
    bullets: [
      '30, 60, and 90 day maturity tiers with explicit APY brackets.',
      'No early unlock path, reducing discretionary risk in treasury planning.',
      'Position lifecycle recorded on-chain for auditable reporting.',
    ],
  },
  'flexible-vault': {
    title: 'Flexible Vault',
    summary: 'Liquid savings vault for daily operating reserves and surplus balances.',
    bullets: [
      'Deposit and withdrawal access without lockup penalties.',
      'Yield accrues continuously and compounds automatically.',
      'Unified accounting view for principal, gain, and share price.',
    ],
  },
  'p2p-transfer': {
    title: 'P2P Transfer',
    summary: 'Fast wallet-to-wallet USDC settlement with no protocol transfer fee.',
    bullets: [
      'Direct Base network execution and transparent transaction tracking.',
      'Supports repeat recipients for recurring treasury workflows.',
      'Finalization and receipt workflow included in dashboard operations.',
    ],
  },
  'risk-monitoring': {
    title: 'Risk Monitoring',
    summary: 'Operational views for liquidity posture, vault utilization, and activity checks.',
    bullets: [
      'Live overview metrics for portfolio and yield movement.',
      'Recent event streams for custody and settlement traceability.',
      'Settings controls for security posture and notifications.',
    ],
  },
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = productMap[id] ?? {
    title: 'Unknown Product',
    summary: 'This module is not currently in the registry.',
    bullets: ['Return to the product index to select a supported module.'],
  }

  return (
    <main className="product-page">
      <Link href="/product" className="protocol-pill" style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={13} />
        Back to products
      </Link>

      <section className="surface" style={{ padding: '1.4rem' }}>
        <span className="protocol-pill">Module Detail</span>
        <h1 className="protocol-heading" style={{ marginTop: '1rem', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          {product.title}
        </h1>
        <p style={{ marginTop: '0.85rem', color: 'var(--color-text-soft)', lineHeight: 1.7 }}>{product.summary}</p>

        <ul className="list-lines" style={{ marginTop: '1rem' }}>
          {product.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
