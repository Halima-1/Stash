'use client'
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="32" height="32" rx="8" fill="url(#lg)" />
      <path
        d="M10 13C10 11.343 11.343 10 13 10H17.5C19.709 10 21.5 11.791 21.5 14C21.5 16.209 19.709 18 17.5 18H14.5C12.291 18 10.5 19.791 10.5 22C10.5 23.657 11.843 25 13.5 25H22"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2775CA" />
          <stop offset="1" stopColor="#4DA3FF" />
        </linearGradient>
      </defs>
    </svg>
  )
}
