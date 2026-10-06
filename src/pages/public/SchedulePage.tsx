import { useMemo, useState } from 'react'
import { Mic, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT, STAGES } from '../../data/event'
import { SCHEDULE } from '../../data/schedule'
import { Card, PageHeader, EmptyState } from '../../components/ui/Card'
import { Chip } from '../../components/ui/Form'
import { Badge, type Tone } from '../../components/ui/Badge'
import type { ScheduleItem } from '../../data/types'

type Filter = 'all' | 'workshop' | 'matching' | 'main'

const KIND_TONE: Record<ScheduleItem['kind'], Tone> = { ceremony: 'accent', talk: 'brand', workshop: 'info', matching: 'success', show: 'danger' }
const KIND_LABEL: Record<ScheduleItem['kind'], [string, string]> = {
  ceremony: ['พิธีการ', 'Ceremony'], talk: ['สัมมนา', 'Talk'], workshop: ['Workshop', 'Workshop'], matching: ['Business Matching', 'Business Matching'], show: ['โชว์', 'Show'],
}

export default function SchedulePage() {
  const { tr, L, fmtDate } = useI18n()
  const [day, setDay] = useState<1 | 2 | 3>(1)
  const [filter, setFilter] = useState<Filter>('all')

  const items = useMemo(
    () =>
      SCHEDULE.filter((s) => s.day === day)
        .filter((s) => filter === 'all' || (filter === 'workshop' && s.kind === 'workshop') || (filter === 'matching' && s.kind === 'matching') || (filter === 'main' && s.stage === 'main'))
        .sort((a, b) => a.start.localeCompare(b.start)),
    [day, filter],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('กำหนดการ', 'Schedule')} title={tr('กิจกรรมตลอด 3 วัน', 'Three days of activities')} subtitle={tr('สัมมนา Workshop และ Business Matching', 'Talks, workshops and Business Matching')} />

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-2 p-1.5">
        {([1, 2, 3] as const).map((d) => (
          <button key={d} onClick={() => setDay(d)} aria-pressed={day === d}
            className={`rounded-xl px-3 py-2.5 text-center transition-colors ${day === d ? 'bg-surface shadow-sm' : 'text-muted hover:text-fg'}`}>
            <div className="text-sm font-bold">Day {d}</div>
            <div className="text-xs text-muted">{fmtDate(EVENT.days[d - 1], { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          </button>
        ))}
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {([
          ['all', 'ทั้งหมด', 'All'],
          ['main', 'Main Stage', 'Main Stage'],
          ['workshop', 'Workshop', 'Workshop'],
          ['matching', 'Business Matching', 'Business Matching'],
        ] as [Filter, string, string][]).map(([f, th, en]) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)} className="shrink-0">{tr(th, en)}</Chip>
        ))}
      </div>

      <div className="mt-6">
        {items.length === 0 ? (
          <EmptyState title={tr('ไม่มีกิจกรรมในหมวดนี้', 'No activities in this filter')} />
        ) : (
          <Card className="overflow-hidden">
            <div className="hidden grid-cols-[120px_1fr_170px] gap-4 bg-surface-2 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
              <div>{tr('เวลา', 'Time')}</div><div>Activity</div><div>Stage</div>
            </div>
            <div className="divide-y divide-line">
              {items.map((s) => (
                <div key={s.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[120px_1fr_170px] sm:items-center sm:gap-4">
                  <div className="font-bold tabular-nums text-brand">{s.start}<span className="font-normal text-muted"> – {s.end}</span></div>
                  <div>
                    <div className="font-semibold">{L(s.title)}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <Badge tone={KIND_TONE[s.kind]}>{tr(...KIND_LABEL[s.kind])}</Badge>
                      {s.speaker && <span className="flex items-center gap-1"><Mic size={12} /> {s.speaker}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted"><Users size={14} /> {L(STAGES[s.stage])}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
