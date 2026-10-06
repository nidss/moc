import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, ClipboardEdit, MapPin, Plus } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYER_BY_ID, OBJECTIVES } from '../../data/buyers'
import { EVENT } from '../../data/event'
import { EXHIBITOR_BY_ID } from '../../data/exhibitors'
import { useDemoStore } from '../../store/demoStore'
import { Card, EmptyState } from '../../components/ui/Card'
import { Button, LinkButton } from '../../components/ui/Button'
import { MeetingStatusBadge, OutcomeBadge } from '../../components/StatusBadges'

export default function MyMeetingsPage() {
  const { tr, L, fmtDate, fmtMoney } = useI18n()
  const [params] = useSearchParams()
  const newId = params.get('new')
  const meetings = useDemoStore((s) => s.myMeetings)
  const updateMeeting = useDemoStore((s) => s.updateMeeting)

  const sorted = [...meetings].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  const days = [...new Set(sorted.map((m) => m.day))]

  return (
    <div className="mx-auto max-w-3xl">
      {newId && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-success-soft p-4 text-success">
          <CheckCircle2 size={22} />
          <div className="text-sm font-semibold">{tr('ส่งคำขอนัดหมายแล้ว — Buyer ยืนยันอัตโนมัติ (เดโม)', 'Meeting requested — auto-confirmed by buyer (demo)')}</div>
        </div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{tr('ตารางนัดหมาย', 'Meeting timeline')}</h2>
        <LinkButton to="/matching" variant="secondary" size="sm" icon={<Plus size={16} />}>{tr('นัดเพิ่ม', 'New meeting')}</LinkButton>
      </div>

      {sorted.length === 0 && <EmptyState title={tr('ยังไม่มีนัดหมาย', 'No meetings yet')} />}

      {days.map((d) => (
        <section key={d} className="mb-6">
          <div className="mb-3 text-sm font-semibold text-muted">Day {d} · {fmtDate(EVENT.days[d - 1], { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <ol className="relative space-y-3 border-l-2 border-line pl-6">
            {sorted.filter((m) => m.day === d).map((m) => {
              const buyer = BUYER_BY_ID[m.buyerId]
              const me = EXHIBITOR_BY_ID[m.exhibitorId]
              return (
                <li key={m.id} className="relative">
                  <span className={`absolute top-5 -left-[31px] size-3.5 rounded-full ring-4 ring-bg ${m.status === 'completed' ? 'bg-success' : m.status === 'pending' ? 'bg-warning' : 'bg-brand'}`} />
                  <Card className={`p-4 sm:p-5 ${m.id === newId ? 'ring-2 ring-success' : ''}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-2xl font-extrabold tabular-nums text-brand">{m.time}</div>
                        <div className="mt-1 font-semibold">
                          {L(me.name)} <span className="text-muted">×</span> {buyer.name}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
                          <span className="flex items-center gap-1"><MapPin size={14} /> Table {m.table}</span>
                          <span>{L(OBJECTIVES[m.objective])}</span>
                        </div>
                      </div>
                      <MeetingStatusBadge status={m.status} />
                    </div>

                    {m.result && (
                      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-surface-2 p-3 text-sm">
                        <OutcomeBadge outcome={m.result.outcome} />
                        <span>{tr('มูลค่าดีล', 'Deal')}: <b>{fmtMoney(m.result.dealValue)}</b></span>
                        <span>{tr('คาดการณ์ 1 ปี', '1-yr forecast')}: <b>{fmtMoney(m.result.forecast)}</b></span>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.status === 'pending' && (
                        <Button size="sm" variant="secondary" onClick={() => updateMeeting(m.id, { status: 'confirmed' })}>
                          {tr('จำลอง: Buyer ยืนยัน', 'Simulate: buyer accepts')}
                        </Button>
                      )}
                      {m.status === 'confirmed' && (
                        <LinkButton to={`/matching/meetings/${m.id}/result`} size="sm" icon={<ClipboardEdit size={16} />}>{tr('บันทึกผลการประชุม', 'Record result')}</LinkButton>
                      )}
                      {m.status === 'completed' && (
                        <Link to={`/matching/meetings/${m.id}/result`} className="text-sm font-semibold text-brand hover:underline">{tr('แก้ไขผล', 'Edit result')}</Link>
                      )}
                    </div>
                  </Card>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
