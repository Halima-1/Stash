import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type GlassButtonVariant = 'primary' | 'secondary' | 'ghost'

type SharedProps = {
  children: ReactNode
  className?: string
  variant?: GlassButtonVariant
}

type ButtonVariantProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
  }

type LinkVariantProps = SharedProps & {
  href: string
  target?: string
  rel?: string
}

type GlassButtonProps = ButtonVariantProps | LinkVariantProps

const variantClass: Record<GlassButtonVariant, string> = {
  primary: 'glass-button glass-button-primary',
  secondary: 'glass-button glass-button-secondary',
  ghost: 'glass-button glass-button-ghost',
}

export function GlassButton(props: GlassButtonProps) {
  const variant = props.variant ?? 'secondary'
  const classes = `${variantClass[variant]} ${props.className ?? ''}`.trim()

  if ('href' in props && typeof props.href === 'string') {
    return (
      <Link href={props.href} className={classes} target={props.target} rel={props.rel}>
        {props.children}
      </Link>
    )
  }

  const buttonProps = { ...props } as Record<string, unknown>
  delete buttonProps.href
  delete buttonProps.variant
  delete buttonProps.className

  return (
    <button className={classes} {...(buttonProps as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {props.children}
    </button>
  )
}
