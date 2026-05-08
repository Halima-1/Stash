export function Aurora() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background:
          'radial-gradient(60rem 45rem at 10% 0%, rgba(80,170,255,0.22), transparent 60%), radial-gradient(50rem 40rem at 90% 15%, rgba(90,120,255,0.16), transparent 58%), linear-gradient(160deg, #070b16 0%, #0b1430 50%, #081226 100%)',
      }}
    />
  )
}
