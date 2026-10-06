import { Apple, Cpu, Flower2, Gem, Home, Leaf, Shirt, Store, type LucideIcon } from 'lucide-react'
import type { CategoryId, Exhibitor, Buyer } from '../data/types'
import logoColor from '../assets/brand/moc-expo-2026.webp'
import logoLight from '../assets/brand/moc-expo-2026-light.webp'

/**
 * โลโก้งาน MOC Expo 2026 (ไฟล์ทางการจากผู้จัด)
 * - tone="auto": สีปกติบนพื้นสว่าง และสลับเป็นตัวอักษรขาวอัตโนมัติเมื่อเป็น dark mode
 * - tone="light": ใช้บนพื้นกรมท่าเข้ม (Hero, footer, sidebar)
 */
export function Logo({ tone = 'auto', className = 'h-10' }: { tone?: 'auto' | 'light'; className?: string }) {
  const alt = 'MOC Expo 2026 — Connect · Collaborate · Grow Together'
  if (tone === 'light') return <img src={logoLight} alt={alt} className={`w-auto select-none ${className}`} draggable={false} />
  return (
    <picture>
      <source srcSet={logoLight} media="(prefers-color-scheme: dark)" />
      <img src={logoColor} alt={alt} className={`w-auto select-none ${className}`} draggable={false} />
    </picture>
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
