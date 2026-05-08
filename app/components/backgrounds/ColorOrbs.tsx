export function ColorOrbs() {
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'saturate(120%)',
        background:
          'radial-gradient(26rem 26rem at 18% 22%, rgba(77,163,255,0.28), transparent 68%), radial-gradient(22rem 22rem at 82% 30%, rgba(123,216,154,0.24), transparent 70%), radial-gradient(32rem 32rem at 55% 88%, rgba(110,145,255,0.20), transparent 72%), #060b19',
      }}
    />
  )
}
