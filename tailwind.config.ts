import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stash: {
          accent: '#2775CA',
          glow: '#4DA3FF',
          dark: '#060B14',
          light: '#F7F9FC',
          text: '#E6EDF3',
          muted: '#9FB0C3',
        },
      },
      boxShadow: {
        glass: '0 26px 52px rgba(2, 10, 24, 0.4)',
        glow: '0 0 28px rgba(77, 163, 255, 0.36)',
      },
      backdropBlur: {
        glass: '24px',
        liquid: '30px',
      },
      borderRadius: {
        liquid: '24px',
      },
    },
  },
}

export default config
