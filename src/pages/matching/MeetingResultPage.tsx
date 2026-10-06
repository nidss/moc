import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Save, TrendingUp } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYER_BY_ID } from '../../data/buyers'
import { EXHIBITOR_BY_ID } from '../../data/exhibitors'
import { useDemoStore } from '../../store/demoStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input, Textarea } from '../../components/ui/Form'
import { OUTCOME_LABEL } from '../../components/StatusBadges'
import type { MeetingOutcome } from '../../data/types'

const toNum = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0

export default function MeetingResultPage() {
  const { id = '' } = useParams()
  const { tr, L, fmtNumber, fmtMoney } = useI18n()
  const navigate = useNavigate()
  const meeting = useDemoStore((s) => s.myMeetings.find((m) => m.id === id))
  const saveResult = useDemoStore((s) => s.saveResult)
  const [outcome, setOutcome] = useState<MeetingOutcome>(meeting?.result?.outcome ?? 'deal')
  const [deal, setDeal] = useState(meeting?.result ? String(meeting.result.dealValue) : '500000')
  const [forecast, setForecast] = useState(meeting?.result ? String(meeting.result.forecast) : '2000000')
  const [note, setNote] = useState(meeting?.result?.note ?? '')

  if (!meeting) return <Navigate to="/matching/meetings" replace />
  const buyer = BUYER_BY_ID[meeting.buyerId]
  const me = EXHIBITOR_BY_ID[meeting.exhibitorId]
  const hasValue = outcome === 'deal' || outcome === 'followup'

  const save = () => {
    saveResult(meeting.id, {
      outcome,
      dealValue: outcome === 'deal' ? toNum(deal) : 0,
      forecast: hasValue ? toNum(forecast) : 0,
      note,
      savedAt: new Date().toISOString(),
    })
    navigate('/matching/meetings')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">{tr('ผลการประชุม', 'Meeting result')} · {meeting.id}</div>
        <h2 className="mt-1 text-xl font-bold">{L(me.name)} × {buyer.name}</h2>
        <div className="text-sm text-muted">Day {meeting.day} · {meeting.time} · Table {meeting.table}</div>
      </div>
      <Card className="space-y-6 p-5 sm:p-6">
        <div>
          <div className="mb-2 font-semibold">{tr('ผลการเจรจา', 'Outcome')}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(Object.keys(OUTCOME_LABEL) as MeetingOutcome[]).map((o) => {
              const [, th, en] = OUTCOME_LABEL[o]
              return (
                <button key={o} onClick={() => setOutcome(o)} aria-pressed={outcome === o}
                  className={`rounded-xl border px-3 py-3 text-sm font-semibold ${outcome === o ? 'border-brand bg-brand text-white dark:text-[#0a1120]' : 'border-line hover:border-brand/50'}`}>
                  {tr(th, en)}
                </button>
              )
            })}
          </div>
        </div>

        {hasValue && (
          <div className="grid gap-4 sm:grid-cols-2">
            {outcome === 'deal' && (
              <Field label={tr('มูลค่าดีล (บาท)', 'Deal value (THB)')} hint={fmtMoney(toNum(deal))}>
                <Input inputMode="numeric" value={fmtNumber(toNum(deal))} onChange={(e) => setDeal(e.target.value)} />
              </Field>
            )}
            <Field label={tr('คาดการณ์มูลค่า 1 ปี (บาท)', 'Forecast 1 year (THB)')} hint={fmtMoney(toNum(forecast))}>
              <Input inputMode="numeric" value={fmtNumber(toNum(forecast))} onChange={(e) => setForecast(e.target.value)} />
            </Field>
          </div>
        )}

        <Field label={tr('บันทึกเพิ่มเติม', 'Note')}>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={tr('เช่น สั่งซื้อทดลอง 2,000 ถุง ส่งมอบ ม.ค. 2570', 'e.g. trial order of 2,000 bags, delivery Jan 2027')} />
        </Field>

        {outcome === 'deal' && (
          <div className="flex items-start gap-3 rounded-xl bg-success-soft p-4 text-sm text-success">
            <TrendingUp size={20} className="shrink-0" />
            {tr('มูลค่าดีลและ Forecast จะถูกรวมเข้า KPI เศรษฐกิจของโครงการบน Admin Dashboard ทันที', 'Deal value and forecast roll up into the project economic KPIs on the Admin Dashboard immediately.')}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-line pt-5">
          <Button variant="secondary" onClick={() => navigate(-1)}>{tr('ยกเลิก', 'Cancel')}</Button>
          <Button onClick={save} icon={<Save size={18} />}>{tr('บันทึกผล', 'Save Result')}</Button>
        </div>
      </Card>
    </div>
  )
}
