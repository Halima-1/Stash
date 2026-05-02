import { ArrowUpRight, History, LockKeyhole, PieChart, Plus, TrendingUp, Wallet } from 'lucide-react'
import { GlassButton } from '@/app/components/GlassButton'
import { GlassCard } from '@/app/components/GlassCard'

const activity = [
  { label: 'Flexible deposit', detail: '+5,000 USDC', time: '2m ago' },
  { label: 'Reward distribution', detail: '+128.40 USDC', time: '1h ago' },
  { label: 'Transfer settlement', detail: '-10,000 USDC', time: '7h ago' },
  { label: 'Fixed stake opened', detail: '90 days · 12.5% APY', time: '1d ago' },
]

export default function Overview() {
  return (
    <section className="dashboard-page dashboard-overview-page">
      <GlassCard tone="hero" className="overview-hero">
        <div className="overview-hero-head">
          <span className="protocol-pill">Portfolio Balance</span>
          <span className="hero-performance">
            <ArrowUpRight size={14} />
            +3.84% today
          </span>
        </div>

        <h1 className="hero-balance">
          $535,000
          <span>USDC</span>
        </h1>

        <p className="hero-caption">
          Institutional treasury balance across flexible and fixed vaults, with real-time settlement visibility.
        </p>

        <div className="hero-cta-row">
          <GlassButton href="/dashboard/flexible" variant="primary">
            <Plus size={15} />
            Deposit
          </GlassButton>
          <GlassButton href="/dashboard/fixed" variant="secondary">
            <LockKeyhole size={15} />
            Stake
          </GlassButton>
        </div>

        <div className="hero-signal-row">
          <div>
            <span>Available wallet</span>
            <strong>12,450 USDC</strong>
          </div>
          <div>
            <span>Monthly realized yield</span>
            <strong>+5,432.57 USDC</strong>
          </div>
          <div>
            <span>Open positions</span>
            <strong>2 active vaults</strong>
          </div>
        </div>
      </GlassCard>

      <div className="overview-grid">
        <GlassCard tone="soft" className="overview-panel overview-panel-portfolio">
          <div className="panel-title-row">
            <h3>
              <Wallet size={16} />
              Portfolio Overview
            </h3>
            <span className="inline-note">Live allocation</span>
          </div>

          <div className="overview-statline">
            <div>
              <span>Flexible Vault</span>
              <strong>385,000 USDC</strong>
              <p>72% of managed balance</p>
            </div>
            <div>
              <span>Fixed Vault</span>
              <strong>150,000 USDC</strong>
              <p>28% locked in term yield</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard tone="soft" className="overview-panel overview-panel-allocation">
          <div className="panel-title-row">
            <h3>
              <PieChart size={16} />
              Vault Allocation
            </h3>
          </div>

          <div className="allocation-bars">
            <div>
              <div className="row-between">
                <span>Flexible Vault</span>
                <strong>72%</strong>
              </div>
              <i style={{ width: '72%' }} />
            </div>
            <div>
              <div className="row-between">
                <span>Fixed Vault</span>
                <strong>28%</strong>
              </div>
              <i style={{ width: '28%' }} />
            </div>
          </div>
        </GlassCard>

        <GlassCard tone="soft" className="overview-panel overview-panel-yield">
          <div className="panel-title-row">
            <h3>
              <TrendingUp size={16} />
              Yield Analytics
            </h3>
            <span className="inline-note">30D performance</span>
          </div>

          <div className="yield-grid">
            <article>
              <span>Average APY</span>
              <strong>8.42%</strong>
            </article>
            <article>
              <span>Projected next month</span>
              <strong>+3,760 USDC</strong>
            </article>
          </div>
        </GlassCard>

        <GlassCard tone="soft" className="overview-panel overview-panel-activity">
          <div className="panel-title-row">
            <h3>
              <History size={16} />
              Activity Feed
            </h3>
            <span className="inline-note">Latest protocol events</span>
          </div>

          <ul className="activity-feed">
            {activity.map((item) => (
              <li key={`${item.label}-${item.time}`}>
                <div>
                  <p>{item.label}</p>
                  <span>{item.detail}</span>
                </div>
                <time>{item.time}</time>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </section>
  )
}
