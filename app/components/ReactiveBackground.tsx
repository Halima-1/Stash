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

    const SPACING = 36
    let frame = 0
    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      const cols = Math.ceil(canvas.width / SPACING) + 1
      const rows = Math.ceil(canvas.height / SPACING) + 1

      // Wave travels left to right
      // Each dot pulses based on its x position offset by time
      const waveSpeed = 0.015
      const waveWidth = 8 // how many columns wide the pulse is

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * SPACING
          const y = j * SPACING

          // Wave position: sin wave traveling left to right
          const wavePos = (frame * waveSpeed) % cols
          const distFromWave = Math.abs(i - wavePos * waveWidth)
          const pulse = Math.max(0, 1 - distFromWave / waveWidth)

          // Base alpha + pulse boost
          const baseAlpha = 0.18
          const pulseAlpha = baseAlpha + pulse * 0.55

          // Base color: light blue, pulse to darker blue
          const r = Math.round(39 + pulse * (-10))
          const g = Math.round(130 + pulse * (-60))
          const b = Math.round(220 + pulse * (35))

          ctx.beginPath()
          ctx.arc(x, y, 1.8 + pulse * 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pulseAlpha})`
          ctx.fill()

          // Glow ring on pulse peak
          if (pulse > 0.6) {
            ctx.beginPath()
            ctx.arc(x, y, 3.5 + pulse * 3, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${pulse * 0.12})`
            ctx.fill()
          }
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
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
