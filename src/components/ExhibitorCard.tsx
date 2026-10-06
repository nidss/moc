import { Link } from 'react-router-dom'
import { Briefcase, MapPin } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { CATEGORIES, PAVILIONS, PROVINCES } from '../data/event'
import type { Exhibitor } from '../data/types'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { OrgAvatar } from './Brand'

export function ExhibitorCard({ ex }: { ex: Exhibitor }) {
  const { tr, L } = useI18n()
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link to={`/exhibitors/${ex.id}`} className="relative block overflow-hidden">
        <img src={ex.banner} alt={L(ex.name)} loading="lazy" decoding="async" width={1200} height={400} className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute top-3 left-3 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ background: PAVILIONS[ex.pavilion].color }}>
          {PAVILIONS[ex.pavilion].name}
        </span>
        <span className="absolute top-3 right-3 rounded-full bg-surface/90 px-2 py-0.5 text-[11px] font-semibold text-muted">Booth {ex.booth}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <OrgAvatar org={ex} size="sm" />
          <div className="min-w-0">
            <Link to={`/exhibitors/${ex.id}`} className="line-clamp-1 font-bold hover:text-brand">{L(ex.name)}</Link>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <MapPin size={12} /> {L(PROVINCES[ex.province])}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="brand">{L(CATEGORIES[ex.category])}</Badge>
          {ex.agency && <Badge tone="accent">{ex.agency}</Badge>}
          {ex.tags.includes('export-ready') && <Badge tone="info">Export-ready</Badge>}
          {ex.tags.includes('healthy') && <Badge tone="success">{tr('สุขภาพ', 'Healthy')}</Badge>}
        </div>
        <div className="mt-auto grid grid-cols-3 gap-1.5 pt-4 text-xs font-semibold">
          <Link to={`/exhibitors/${ex.id}`} className="rounded-lg bg-surface-2 px-2 py-2 text-center hover:bg-brand-soft hover:text-brand">{tr('โปรไฟล์', 'Profile')}</Link>
          <Link to={`/exhibitors/${ex.id}#products`} className="rounded-lg bg-surface-2 px-2 py-2 text-center hover:bg-brand-soft hover:text-brand">{tr('สินค้า', 'Products')}</Link>
          <Link to="/matching" className="flex items-center justify-center gap-1 rounded-lg bg-brand-soft px-2 py-2 text-center text-brand hover:bg-brand hover:text-white">
            <Briefcase size={12} /> Match
          </Link>
        </div>
      </div>
    </Card>
  )
}
