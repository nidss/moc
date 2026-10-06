import { useState } from 'react'
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, Clock } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYER_BY_ID, OBJECTIVES, TIME_SLOTS } from '../../data/buyers'
import { EVENT } from '../../data/event'
import { DEMO_SME_ID } from '../../data/exhibitors'
import { useDemoStore } from '../../store/demoStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Textarea } from '../../components/ui/Form'
import { OrgAvatar } from '../../components/Brand'
import type { Meeting } from '../../data/types'

export default function RequestMeetingPage() {
  const { buyerId = '' } = useParams()
  const { tr, L, fmtDate } = useI18n()
  const navigate = useNavigate()
  const myMeetings = useDemoStore((s) => s.myMeetings)
  const requestMeeting = useDemoStore((s) => s.requestMeeting)
  const buyer = BUYER_BY_ID[buyerId]
  const [day, setDay] = useState<1 | 2 | 3>(1)
  const [time, setTime] = useState('')
  const [objective, setObjective] = useState<Meeting['objective']>('distribution')
  const [note, setNote] = useState('')

  if (!buyer) return <Navigate to="/matching" replace />

  const isTaken = (d: number, t: string) =>
    buyer.slotsTaken.includes(`${d}-${t}`) ||
    myMeetings.some((m) => m.day === d && m.time === t && m.status !== 'cancelled')

  const confirm = () => {
    if (!time) return
    const m = requestMeeting({ exhibitorId: DEMO_SME_ID, buyerId: buyer.id, day, time, objective, note })
    navigate(`/matching/meetings?new=${m.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/matching" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-brand">
        <ArrowLeft size={16} /> {tr('กลับไปค้นหา Buyer', 'Back to buyers')}
      </Link>
      <Card className="mb-5 flex items-center gap-4 p-5">
        <OrgAvatar org={buyer} />
        <div>
          <div className="text-xs text-muted">{tr('ขอนัดประชุมกับ', 'Request a meeting with')}</div>
          <div className="text-lg font-bold">{buyer.name}</div>
          <div className="text-sm text-muted">{L(buyer.type)} · {L(buyer.country)}</div>
        </div>
      </Card>

      <Card className="space-y-6 p-5 sm:p-6">
        <div>
          <div className="mb-2 font-semibold">1. {tr('เลือกวัน', 'Select date')}</div>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as const).map((d) => (
              <button key={d} onClick={() => { setDay(d); setTime('') }} aria-pressed={day === d}
                className={`rounded-xl border p-3 text-center ${day === d ? 'border-brand bg-brand-soft text-brand' : 'border-line hover:border-brand/50'}`}>
                <div className="text-sm font-bold">Day {d}</div>
                <div className="text-xs text-muted">{fmtDate(EVENT.days[d - 1], { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold">2. {tr('เลือกเวลา (30 นาที)', 'Select time (30 min)')}</span>
            <span className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm border border-line bg-surface-2" />{tr('ไม่ว่าง', 'Taken')}</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TIME_SLOTS.map((t) => {
              const taken = isTaken(day, t)
              return (
                <button key={t} disabled={taken} onClick={() => setTime(t)} aria-pressed={time === t}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-semibold tabular-nums ${taken ? 'cursor-not-allowed border-line bg-surface-2 text-muted line-through' : time === t ? 'border-brand bg-brand text-white dark:text-[#0a1120]' : 'border-line hover:border-brand/50'}`}>
                  <Clock size={14} /> {t}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">3. {tr('วัตถุประสงค์การประชุม', 'Meeting objective')}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(OBJECTIVES) as Meeting['objective'][]).map((o) => (
              <label key={o} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm font-medium ${objective === o ? 'border-brand bg-brand-soft text-brand' : 'border-line'}`}>
                <input type="radio" name="objective" checked={objective === o} onChange={() => setObjective(o)} className="accent-[var(--brand)]" />
                {L(OBJECTIVES[o])}
              </label>
            ))}
          </div>
        </div>

        <Field label={tr('ข้อความถึง Buyer (ไม่บังคับ)', 'Message to buyer (optional)')}>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={tr('เช่น แนะนำสินค้า กำลังการผลิต ใบรับรอง', 'e.g. product intro, capacity, certifications')} />
        </Field>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            {time ? (
              <>{tr('สรุป', 'Summary')}: <b className="text-fg">Day {day} · {time}</b> · {L(OBJECTIVES[objective])}</>
            ) : tr('กรุณาเลือกเวลา', 'Please choose a time slot')}
          </div>
          <Button disabled={!time} onClick={confirm} icon={<CalendarCheck size={18} />}>{tr('ยืนยันนัดหมาย', 'Confirm Meeting')}</Button>
        </div>
      </Card>
    </div>
  )
}
