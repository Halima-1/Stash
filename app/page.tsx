'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, ChevronRight, Globe, Lock, Moon, Sun, TrendingUp, Zap, Menu, X } from 'lucide-react'
import { ConnectButton } from './components/ConnectButton'
import { useTheme } from './context/ThemeContext'

import stashLogoAsset from './images/stashLogo.png'
import usdcAsset from './images/usdc.webp'

const stats = [
  { label: 'Total Value Locked', value: '$4.2M', note: '+12.4% this quarter' },
  { label: 'Active Accounts', value: '2,847', note: 'Across fixed + flexible' },
  { label: 'Current Flexible APY', value: '8.42%', note: 'Compounding by block' },
  { label: 'Settlement Layer', value: 'Base L2', note: 'Low fee execution' },
]

const features = [
  {
    icon: Lock,
    tag: 'Fixed Vault',
    title: 'Term-based yield with enforceable maturity.',
    body: 'Lock USDC for 30, 60, or 90 days with deterministic terms and contract-enforced principal safety.',
    href: '/dashboard/fixed',
  },
  {
    icon: Zap,
    tag: 'Flexible Vault',
    title: 'Liquid savings designed for operating capital.',
    body: 'Deposit and withdraw at any time while your idle USDC compounds continuously in a non-custodial vault.',
    href: '/dashboard/flexible',
  },
  {
    icon: Globe,
    tag: 'P2P Transfer',
    title: 'Instant USDC transfers without protocol fees.',
    body: 'Send stablecoins to any Base wallet with real-time finality and full on-chain settlement transparency.',
    href: '/dashboard/transfer',
  },
]

const liveMetrics = [
  { label: 'Flexible APY', value: '8.42%', color: '#4DA3FF' },
  { label: 'Fixed 90D APY', value: '12.50%', color: '#7BD89A' },
  { label: 'TVL', value: '$4.2M', color: '#4DA3FF' },
  { label: 'Base Network', value: 'Live', color: '#7BD89A' },
  { label: 'Positions', value: '2,847', color: '#4DA3FF' },
  { label: 'Settlement', value: 'Instant', color: '#7BD89A' },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggle } = useTheme()
  const [tick, setTick] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 2000)
    return () => clearInterval(t)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <main className="home-page">
      

      {/* NAV */}
      <nav className={`home-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="home-brand">
          <span className="brand-mark brand-mark-usdc">
            <Image
              src={stashLogoAsset}
              alt="Stash"
              width={22}
              height={22}
              style={{ objectFit: 'contain' }}
            />
          </span>
          <span>stash</span>
        </Link>

        {/* Desktop right */}
        <div className="home-nav-right home-nav-desktop">
          <Link href="/dashboard/overview" className="protocol-button protocol-button-primary home-nav-cta">
            Dashboard
            <ArrowRight size={14} />
          </Link>
          <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <ConnectButton compact />
        </div>

        {/* Mobile controls */}
        <div className="home-nav-mobile">
          <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="home-nav-drawer">
          <ConnectButton />
          <Link
            href="/dashboard/overview"
            className="protocol-button protocol-button-primary"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
            <ArrowRight size={14} />
          </Link>
          <Link href="/dashboard/flexible" className="protocol-button protocol-button-secondary" onClick={() => setMenuOpen(false)}>
            Flexible Vault
          </Link>
          <Link href="/dashboard/fixed" className="protocol-button protocol-button-secondary" onClick={() => setMenuOpen(false)}>
            Fixed Vault
          </Link>
          <Link href="/dashboard/transfer" className="protocol-button protocol-button-secondary" onClick={() => setMenuOpen(false)}>
            Transfer
          </Link>
        </div>
      )}

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-grid">

          {/* Copy */}
          <div className="home-hero-copy">
            <span className="protocol-pill">
              <TrendingUp size={13} />
              Live on Base Sepolia
            </span>
            <h1 className="protocol-heading">
              Institutional-grade stablecoin rails for
              <span> savings, transfers, and yield.</span>
            </h1>
            <p>
              Stash is a non-custodial USDC protocol with fixed-term and liquid vaults, plus direct wallet-to-wallet settlement.
              Control remains with your wallet at every step.
            </p>
            <div className="home-hero-actions">
              <Link href="/dashboard/overview" className="protocol-button protocol-button-primary">
                Open Dashboard
                <ArrowRight size={15} />
              </Link>
              <Link href="/dashboard/flexible" className="protocol-button protocol-button-secondary">
                Explore Vaults
              </Link>
            </div>
          </div>

          {/* Hero card */}
          <aside className="home-hero-visual" aria-label="Protocol overview">
            <div className="surface home-hero-brand-card" style={{
              minHeight: '22rem', padding: 0,
              overflow: 'hidden', position: 'relative',
            }}>
              <Image
                src={usdcAsset}
                alt="USDC"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            </div>
          </aside>
        </div>

        {/* Stats strip */}
        <div className="home-strip">
          {stats.map((item) => (
            <article key={item.label} className="surface-soft home-strip-card">
              <span>{item.label}</span>
              <h3>{item.value}</h3>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <header className="home-section-header">
          <span className="protocol-pill">Protocol Products</span>
          <h2 className="protocol-heading">Three capital workflows, one coherent execution layer.</h2>
          <p>
            Every route is designed for predictable operations: enforceable lockups when needed,
            liquidity on demand when timing matters, and instant stablecoin movement for treasury coordination.
          </p>
        </header>
        <div className="home-feature-grid">
          {features.map(({ icon: Icon, tag, title, body, href }) => (
            <Link key={tag} href={href} className="home-feature-card">
              <span className="home-feature-icon">
                <Icon size={18} />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
              <span>
                {tag}
                <ChevronRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home-section">
        <div className="surface home-cta">
          <div>
            <span className="protocol-pill">Non-custodial by default</span>
            <h3 className="protocol-heading">Deploy idle USDC without sacrificing control.</h3>
            <p>Connect your wallet, pick a strategy, and manage positions from one operational dashboard.</p>
          </div>
          <Link href="/dashboard/overview" className="protocol-button protocol-button-primary">
            Enter App
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Image src={stashLogoAsset} alt="Stash" width={20} height={20} style={{ objectFit: 'contain' }} />
          <span>stash</span>
        </div>
        <span>Built on Base · Non-custodial contracts · Treasury-first UX</span>
        <a
          href="https://sepolia.basescan.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent-bright)' }}
        >
          BaseScan →
        </a>
      </footer>
    </main>
  )
}
