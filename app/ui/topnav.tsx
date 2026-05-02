'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '../components/ConnectButton'
import { useTheme } from '../context/ThemeContext'
import stashLogoAsset from '../images/stashLogo.png'

const navItems = [
  { href: '/dashboard/overview', label: 'Overview' },
  { href: '/dashboard/flexible', label: 'Flexible' },
  { href: '/dashboard/fixed', label: 'Fixed' },
  { href: '/dashboard/transfer', label: 'Transfer' },
]

export default function TopNav() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <header className="dashboard-top-nav surface">
      <div className="dashboard-top-nav-row">
        <Link href="/" className="top-brand" aria-label="Go to homepage">
          <span className="brand-mark brand-mark-usdc">
            <Image
              src={stashLogoAsset}
              alt="Stash"
              width={22}
              height={22}
              style={{ objectFit: 'contain' }}
            />
          </span>
          <span>Stash</span>
        </Link>

        <nav className="dashboard-top-links" aria-label="Dashboard">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={active ? 'active' : ''}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="dashboard-top-actions">
          <button type="button" className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <ConnectButton compact />
        </div>
      </div>
    </header>
  )
}
