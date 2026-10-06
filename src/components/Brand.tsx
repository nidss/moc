import { Apple, Cpu, Flower2, Gem, Home, Leaf, Shirt, Store, type LucideIcon } from 'lucide-react'
import type { CategoryId, Exhibitor, Buyer } from '../data/types'

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="14" fill={light ? '#ffffff' : '#0b2a5b'} />
        <path d="M14 44V20l9 14 9-14v24" fill="none" stroke="#f5a300" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="46" cy="32" r="8" fill="none" stroke={light ? '#0b2a5b' : '#ffffff'} strokeWidth="5" />
      </svg>
      {!compact && (
        <span className="leading-tight">
          <span className={`block text-[15px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-fg'}`}>MOC Expo 2026</span>
          <span className={`block text-[11px] font-medium ${light ? 'text-white/70' : 'text-muted'}`}>Ministry of Commerce</span>
        </span>
      )}
    </span>
  )
}

export const CATEGORY_ICON: Record<CategoryId, LucideIcon> = {
  food: Apple,
  health: Flower2,
  fashion: Shirt,
  home: Home,
  agri: Leaf,
  craft: Gem,
  tech: Cpu,
  service: Store,
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function OrgAvatar({ org, size = 'md' }: { org: Pick<Exhibitor, 'color'> & { brand?: string; name: Exhibitor['name'] | Buyer['name'] }; size?: 'sm' | 'md' | 'lg' }) {
  const label = typeof org.name === 'string' ? org.name : org.name.en
  const cls = size === 'lg' ? 'size-20 text-2xl rounded-2xl' : size === 'sm' ? 'size-9 text-xs rounded-lg' : 'size-12 text-sm rounded-xl'
  return (
    <span className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${cls}`}
      style={{ background: `linear-gradient(135deg, ${org.color}, ${org.color}cc)` }}>
      {initials(label)}
    </span>
  )
}

/** ภาพแทนสินค้า (ไม่มีรูปจริงใน Demo) */
export function ProductArt({ category, color, className = '' }: { category: CategoryId; color: string; className?: string }) {
  const Icon = CATEGORY_ICON[category]
  return (
    <div className={`flex items-center justify-center ${className}`}
      style={{ background: `radial-gradient(circle at 30% 20%, ${color}33, transparent 60%), linear-gradient(135deg, ${color}1f, ${color}0a)` }}>
      <Icon className="size-1/3 max-h-14 max-w-14" style={{ color }} strokeWidth={1.5} />
    </div>
  )
}
