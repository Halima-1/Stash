'use client'
import { useState } from 'react'
import { Aurora } from './backgrounds/Aurora'
import { ColorOrbs } from './backgrounds/ColorOrbs'
import { MeshGradient } from './backgrounds/MeshGradient'
import { SoftDots } from './backgrounds/SoftDots'

const OPTIONS = ['Aurora', 'Color Orbs', 'Mesh', 'Soft Dots'] as const
type Option = typeof OPTIONS[number]

export function BackgroundSwitcher() {
  const [active, setActive] = useState<Option>('Color Orbs')

  return (
    <>
      {/* Render active background */}
      {active === 'Aurora'      && <Aurora />}
      {active === 'Color Orbs' && <ColorOrbs />}
      {active === 'Mesh'        && <MeshGradient />}
      {active === 'Soft Dots'   && <SoftDots />}

      {/* Picker UI — fixed bottom center */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        display: 'flex', gap: '6px',
        padding: '6px 10px',
        borderRadius: '999px',
        background: 'rgba(10,14,28,0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {OPTIONS.map(opt => (
          <button
            key={opt}
            onClick={() => setActive(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: active === opt
                ? 'rgba(77,163,255,0.30)'
                : 'transparent',
              color: active === opt
                ? '#a8d4ff'
                : 'rgba(255,255,255,0.45)',
              outline: active === opt
                ? '1px solid rgba(77,163,255,0.50)'
                : '1px solid transparent',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  )
}
