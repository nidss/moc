import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap'
const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-strong dark:text-[#0a1120]',
  secondary: 'bg-surface text-fg border border-line hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
  accent: 'gold-gradient text-on-accent shadow-sm shadow-[#c8902a]/30 hover:brightness-105',
  danger: 'bg-danger text-white hover:brightness-95',
  success: 'bg-success text-white hover:brightness-95 dark:text-[#0a1120]',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-13 px-6 text-base',
}

export function btnClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; icon?: ReactNode }

export function Button({ variant, size, icon, className = '', children, ...rest }: BtnProps) {
  return (
    <button className={btnClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

type LinkBtnProps = LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode }

export function LinkButton({ variant, size, icon, className = '', children, ...rest }: LinkBtnProps) {
  return (
    <Link className={btnClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
