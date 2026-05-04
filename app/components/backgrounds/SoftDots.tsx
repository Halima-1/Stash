export function SoftDots() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#071024',
        backgroundImage:
          'radial-gradient(circle at center, rgba(130,190,255,0.16) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    />
  )
}
