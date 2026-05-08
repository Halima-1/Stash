'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, LayoutDashboard, LockKeyhole, Send, Settings2 } from 'lucide-react'

const navItems = [
  { href: '/dashboard/overview', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/flexible', label: 'Flexible Vault', icon: Box },
  { href: '/dashboard/fixed', label: 'Fixed Vault', icon: LockKeyhole },
  { href: '/dashboard/transfer', label: 'Transfer', icon: Send },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings2 },
]

const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="dashboard-rail surface" aria-label="Primary">
      <ul className="dashboard-rail-nav">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <li key={href}>
              <Link href={href} className={isActive ? 'active' : ''} aria-label={label} title={label}>
                <Icon size={17} />
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default Sidebar
