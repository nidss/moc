import { useSearchParams, Link } from 'react-router-dom'
import { MapPin, MousePointerClick } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ZONES } from '../../data/zones'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { Card, PageHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import { OrgAvatar } from '../../components/Brand'

export default function FloorPlanPage() {
  const { tr, L } = useI18n()
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('zone') ?? 'local'
  const zone = ZONES.find((z) => z.id === selectedId) ?? ZONES[0]
  const exhibitors = zone.pavilion ? EXHIBITORS.filter((e) => e.pavilion === zone.pavilion) : []
  const stageKey = zone.kind === 'stage' ? 'main' : zone.kind === 'workshop' ? 'upskill' : zone.kind === 'matching' ? 'matching' : null
  const sessions = stageKey ? SCHEDULE.filter((s) => s.stage === stageKey && s.day === 1) : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('ผังงาน', 'Floor Plan')} title={tr('ผังพื้นที่จัดงาน', 'Event Floor Plan')}
        subtitle={<span className="inline-flex items-center gap-1.5"><MousePointerClick size={16} /> {tr('คลิกที่โซนเพื่อดูรายละเอียดและผู้ออกบูธ', 'Click a zone to see details and exhibitors')}</span>} />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <FloorPlanMap selected={zone.id} onSelect={(id) => setParams({ zone: id }, { replace: true })} />
          <div className="mt-3 flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <button key={z.id} onClick={() => setParams({ zone: z.id }, { replace: true })}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${z.id === zone.id ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface text-muted'}`}>
                <span className="size-2.5 rounded-full" style={{ background: z.color }} /> {L(z.label)}
              </button>
            ))}
          </div>
        </div>

        <Card className="h-fit overflow-hidden">
          <div className="p-5 text-white" style={{ background: zone.color }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80"><MapPin size={14} /> {tr('โซนที่เลือก', 'Selected zone')}</div>
            <div className="mt-1 text-xl font-bold">{L(zone.label)}</div>
            <div className="text-sm opacity-85">{L(zone.desc)}</div>
          </div>
          <div className="p-4">
            {exhibitors.length > 0 && (
              <>
                <div className="mb-2 text-sm font-semibold">{tr(`ผู้ออกบูธในโซน (${exhibitors.length})`, `Exhibitors in zone (${exhibitors.length})`)}</div>
                <div className="divide-y divide-line">
                  {exhibitors.map((e) => (
                    <Link key={e.id} to={`/exhibitors/${e.id}`} className="flex items-center gap-3 py-2.5 hover:text-brand">
                      <OrgAvatar org={e} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{L(e.name)}</div>
                      </div>
                      <Badge>{e.booth}</Badge>
                    </Link>
                  ))}
                </div>
              </>
            )}
            {sessions.length > 0 && (
              <>
                <div className="mb-2 text-sm font-semibold">{tr('กิจกรรมวันนี้ในโซนนี้', "Today's sessions here")}</div>
                <div className="space-y-2">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex gap-3 text-sm">
                      <span className="w-12 shrink-0 font-bold text-brand">{s.start}</span>
                      <span>{L(s.title)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {exhibitors.length === 0 && sessions.length === 0 && (
              <p className="text-sm text-muted">{tr('พื้นที่บริการสำหรับผู้เข้าชมงาน', 'Visitor service area')}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
