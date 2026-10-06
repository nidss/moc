import { useState } from 'react'
import { Heart, QrCode, Star } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemoStore } from '../../store/demoStore'
import { Card } from '../../components/ui/Card'
import { Button, LinkButton } from '../../components/ui/Button'
import { Textarea } from '../../components/ui/Form'
import { SURVEY_TOPICS } from '../../data/event'


function Stars({ value, onChange, size = 28, label }: { value: number; onChange: (v: number) => void; size?: number; label: string }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n}`} onClick={() => onChange(n)} className="p-0.5">
          <Star size={size} className={n <= value ? 'fill-accent text-accent' : 'text-line'} />
        </button>
      ))}
    </div>
  )
}

export default function SurveyPage() {
  const { tr } = useI18n()
  const submitSurvey = useDemoStore((s) => s.submitSurvey)
  const [overall, setOverall] = useState(0)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [nps, setNps] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  const complete = overall > 0 && nps !== null

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Heart size={56} className="mx-auto fill-danger text-danger" />
        <h1 className="mt-4 text-2xl font-bold">{tr('ขอบคุณสำหรับความคิดเห็น!', 'Thank you for your feedback!')}</h1>
        <p className="mt-2 text-muted">{tr('รับคูปองส่วนลด 10% สำหรับร้านค้าใน MOC Online Mall', 'Enjoy a 10% coupon for the MOC Online Mall')}</p>
        <div className="mx-auto mt-6 w-fit rounded-2xl border-2 border-dashed border-accent bg-accent-soft px-8 py-4 font-mono text-xl font-bold tracking-widest">MOCEXPO10</div>
        <LinkButton to="/" variant="secondary" className="mt-8">{tr('กลับหน้าแรก', 'Back to home')}</LinkButton>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-brand-soft p-4 text-sm text-brand">
        <QrCode size={22} className="shrink-0" />
        {tr('เปิดจาก QR Code ที่ประตูทางออก · ใช้เวลาประมาณ 1 นาที', 'Opened from the exit-gate QR code · about 1 minute')}
      </div>
      <h1 className="text-2xl font-bold">{tr('แบบสอบถามความพึงพอใจ', 'Satisfaction Survey')}</h1>

      <Card className="mt-5 p-5 text-center">
        <div className="font-semibold">{tr('คุณพึงพอใจกับงาน MOC Expo 2026 เพียงใด?', 'How satisfied are you with MOC Expo 2026?')}</div>
        <div className="mt-3 flex justify-center"><Stars value={overall} onChange={setOverall} size={40} label="overall" /></div>
      </Card>

      <Card className="mt-4 divide-y divide-line">
        {SURVEY_TOPICS.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <span className="text-sm font-medium">{tr(t.th, t.en)}</span>
            <Stars value={scores[t.id] ?? 0} onChange={(v) => setScores((s) => ({ ...s, [t.id]: v }))} size={22} label={t.en} />
          </div>
        ))}
      </Card>

      <Card className="mt-4 p-5">
        <div className="font-semibold">{tr('คุณจะแนะนำงานนี้ให้เพื่อนหรือไม่?', 'Would you recommend this event?')}</div>
        <div className="mt-3 grid grid-cols-11 gap-1">
          {Array.from({ length: 11 }, (_, n) => (
            <button key={n} onClick={() => setNps(n)} aria-pressed={nps === n}
              className={`aspect-square rounded-lg text-sm font-bold ${nps === n ? 'bg-brand text-white dark:text-[#0a1120]' : 'bg-surface-2 hover:bg-brand-soft'}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-muted">
          <span>{tr('ไม่แนะนำเลย', 'Not at all')}</span>
          <span>{tr('แนะนำแน่นอน', 'Definitely')}</span>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <div className="mb-2 font-semibold">{tr('ข้อเสนอแนะเพิ่มเติม', 'Additional comments')}</div>
        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={tr('สิ่งที่ชอบ หรืออยากให้ปรับปรุง', 'What you liked or what we can improve')} />
      </Card>

      <Button className="mt-6 w-full" size="lg" disabled={!complete}
        onClick={() => {
          submitSurvey({ scores: { overall, ...scores }, nps: nps ?? 0, comment })
          setDone(true)
          window.scrollTo(0, 0)
        }}>
        {tr('ส่งแบบสอบถาม', 'Submit')}
      </Button>
      {!complete && <p className="mt-2 text-center text-xs text-muted">{tr('กรุณาให้คะแนนภาพรวมและ NPS', 'Please rate overall and NPS')}</p>}
    </div>
  )
}
