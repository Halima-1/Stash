'use client'
import { useEffect, useRef } from 'react'

export function ReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const SPACING = 28
    let animId: number

    // Build dot grid once
    const buildDots = () => {
      const cols = Math.ceil(canvas.width / SPACING) + 1
      const rows = Math.ceil(canvas.height / SPACING) + 1
      const dots: any[] = []
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            x: i * SPACING,
            y: j * SPACING,
            phase: Math.random() * Math.PI * 2,      // random start phase
            speed: Math.random() * 0.04 + 0.015,     // random speed
            baseAlpha: Math.random() * 0.08 + 0.06,  // random base brightness
            pulseStrength: Math.random() * 0.45 + 0.2,
          })
        }
      }
      return dots
    }

    let dots = buildDots()
    window.addEventListener('resize', () => { dots = buildDots() })

    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      for (const d of dots) {
        // Each dot pulses independently
        const pulse = (Math.sin(frame * d.speed + d.phase) + 1) / 2  // 0 → 1
        const alpha = d.baseAlpha + pulse * d.pulseStrength

        // Light blue at rest → darker richer blue at peak
        const r = Math.round(100 - pulse * 55)
        const g = Math.round(180 - pulse * 90)
        const b = Math.round(255 - pulse * 30)
        const radius = 0.8 + pulse * 1.2

        ctx.beginPath()
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()

        // Soft glow halo on bright pulses
        if (pulse > 0.7) {
          ctx.beginPath()
          ctx.arc(d.x, d.y, radius + 3 + pulse * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b},${pulse * 0.07})`
          ctx.fill()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
