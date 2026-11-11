import { useSearchParams, Link } from 'react-router-dom'
import { MapPin, MousePointerClick } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { HUB_PAVILIONS, ZONES, hubPavilionOf, type Zone } from '../../data/zones'
import { ZONES as ZONES_V1 } from '../../data/zonesV1'
import { useExhibitors } from '../../store/selectors'
import { AGENCIES, PARTNERS } from '../../data/event'
import { SCHEDULE } from '../../data/schedule'
import { Card, PageHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import { FloorPlanMapV1 } from '../../components/FloorPlanMapV1'
import { FloorPlanVersionToggle, type MapVersion } from '../../components/FloorPlanVersionToggle'

/** ฟิลด์ที่ทั้งผัง V1 และ V2 มีร่วมกัน */
type ZoneInfo = Pick<Zone, 'id' | 'label' | 'desc' | 'color' | 'pavilion'> & { kind: string }
import { OrgAvatar } from '../../components/Brand'

export default function FloorPlanPage() {
  const { tr, L, lang } = useI18n()
  const all = useExhibitors()
  const [params, setParams] = useSearchParams()
  // ?map=v1 = ผังแนวคิด 2.5D เดิม, ค่าเริ่มต้น v2 = ผังตามแบบจริง
  const version: MapVersion = params.get('map') === 'v1' ? 'v1' : 'v2'
  const v2 = version === 'v2'
  const zones: ZoneInfo[] = v2 ? ZONES : ZONES_V1
  const selectedId = params.get('zone') ?? 'hub'
  const zone = zones.find((z) => z.id === selectedId) ?? zones[0]
  const go = (next: { zone?: string; map?: MapVersion }) => {
    const map = next.map ?? version
    setParams({ zone: next.zone ?? zone.id, ...(map === 'v1' ? { map } : {}) }, { replace: true })
  }
  const exhibitors = zone.pavilion ? all.filter((e) => e.pavilion === zone.pavilion)
    .sort((a, b) => v2 ? (hubPavilionOf(a.agency)?.no ?? 99) - (hubPavilionOf(b.agency)?.no ?? 99) : 0) : []
  const stageKey = zone.kind === 'stage' ? 'main' : zone.kind === 'workshop' ? 'workshop' : zone.kind === 'matching' ? 'matching' : zone.id === 'taste' ? 'taste' : null
  const sessions = stageKey ? SCHEDULE.filter((s) => s.stage === stageKey && s.day === 1) : []

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('ผังงาน', 'Floor Plan')} title={tr('ผังพื้นที่จัดงาน', 'Event Floor Plan')}
        subtitle={<span className="inline-flex items-center gap-1.5"><MousePointerClick size={16} /> {tr('คลิกที่โซนเพื่อดูรายละเอียดและผู้ออกบูธ', 'Click a zone to see details and exhibitors')}</span>}
        actions={<FloorPlanVersionToggle value={version} onChange={(map) => go({ map })} />} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {v2
            ? <FloorPlanMap selected={zone.id} onSelect={(id) => go({ zone: id })} />
            : <FloorPlanMapV1 selected={zone.id} onSelect={(id) => go({ zone: id })} />}
          {/* V2 มีรายการโซนข้างผังบนจอกว้างแล้ว จึงซ่อนปุ่มชุดนี้ */}
          <div className={`mt-3 flex flex-wrap gap-2 ${v2 ? 'lg:hidden' : ''}`}>
            {zones.map((z) => (
              <button key={z.id} aria-pressed={z.id === zone.id} onClick={() => go({ zone: z.id })}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${z.id === zone.id ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-surface text-muted'}`}>
                <span className="size-2.5 rounded-full" style={{ background: z.color }} /> {L(z.label)}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">{v2
            ? tr('วาดตามผังจริงของงานที่ Hall 7–8 · ตำแหน่งบูธรายร้านเป็นข้อมูลจำลองสำหรับการสาธิต', 'Drawn from the actual Hall 7–8 layout · Individual booth positions are demo data.')
            : tr('ผังแนวคิดสำหรับการสาธิต · ตำแหน่งบูธและทางเดินเป็นภาพจำลอง ไม่ใช่ผังทางการของสถานที่', 'Concept layout for the demo · Booths and aisles are illustrative, not the official venue plan.')}</p>
        </div>

        <Card className="h-fit overflow-hidden xl:sticky xl:top-24">
          <div className="p-5 text-white" style={{ background: zone.color }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80"><MapPin size={14} /> {tr('โซนที่เลือก', 'Selected zone')}</div>
            <div className="mt-1 text-xl font-bold">{L(zone.label)}</div>
            <div className="text-sm opacity-85">{L(zone.desc)}</div>
          </div>
          <div className="p-4">
            {v2 && zone.id === 'hub' && (
              <div className="mb-4 grid grid-cols-3 gap-1.5">
                {HUB_PAVILIONS.map((p) => (
                  <div key={p.no} className="rounded-lg bg-surface-2 px-2 py-1.5 text-center">
                    <div className="text-[10px] text-muted">Pavilion {p.no}</div>
                    <div className="text-xs font-bold">{lang === 'th' ? p.abbr : p.agency}</div>
                  </div>
                ))}
              </div>
            )}
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
                      {v2 && zone.id === 'hub' && hubPavilionOf(e.agency) && <span className="text-[11px] text-muted">P{hubPavilionOf(e.agency)!.no}</span>}
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
            {zone.id === 'consult' && (
              <div className="space-y-3">
                <div className="text-sm font-semibold">{tr('หน่วยงานให้คำปรึกษา (14)', 'Advisory agencies (14)')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(AGENCIES).map((a) => <Badge key={a.short} tone="brand">{a.short}</Badge>)}
                  {PARTNERS.map((p) => <Badge key={p.en} tone="accent">{L(p)}</Badge>)}
                </div>
              </div>
            )}
            {exhibitors.length === 0 && sessions.length === 0 && zone.id !== 'consult' && (
              <p className="text-sm text-muted">{tr('พื้นที่บริการสำหรับผู้เข้าชมงาน', 'Visitor service area')}</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
