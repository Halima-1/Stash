import type { ElementType, HTMLAttributes, ReactNode } from 'react'

type GlassCardTone = 'default' | 'soft' | 'hero'

type GlassCardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  tone?: GlassCardTone
  children: ReactNode
}

const toneClass: Record<GlassCardTone, string> = {
  default: 'glass-card',
  soft: 'glass-card glass-card-soft',
  hero: 'glass-card glass-card-hero',
}

export function GlassCard({ as: Component = 'section', tone = 'default', className = '', children, ...rest }: GlassCardProps) {
  const classes = `${toneClass[tone]} ${className}`.trim()

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
