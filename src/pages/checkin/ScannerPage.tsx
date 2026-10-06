import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Search, Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ATTENDEE_TYPES } from '../../data/event'
import { useAttendees } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import { QrScanner } from '../../components/QrScanner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Form'
import { CheckinBadge } from '../../components/StatusBadges'

export default function ScannerPage() {
  const { tr, L, fmtNumber } = useI18n()
  const navigate = useNavigate()
  const attendees = useAttendees()
  const lastId = useDemoStore((s) => s.lastRegisteredId)
  const checkins = useDemoStore((s) => s.checkins)
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (needle.length < 2) return []
    return attendees
      .filter((a) => [a.name, a.id, a.phone.replace(/-/g, ''), a.email].some((v) => v.toLowerCase().includes(needle.replace(/-/g, ''))))
      .slice(0, 6)
  }, [attendees, q])

  const recent = useMemo(
    () =>
      Object.entries(checkins)
        .sort((a, b) => b[1].localeCompare(a[1]))
        .slice(0, 5)
        .map(([id, at]) => ({ at, a: attendees.find((x) => x.id === id) }))
        .filter((x) => x.a),
    [checkins, attendees],
  )

  const simulate = () => {
    const target =
      (lastId && !attendees.find((a) => a.id === lastId)?.checkedInAt ? lastId : undefined) ??
      attendees.find((a) => !a.checkedInAt)?.id
    if (target) navigate(`/staff/scan/${target}`)
  }

  return (
    <div className="space-y-5">
      <QrScanner onResult={(text) => navigate(`/staff/scan/${encodeURIComponent(text)}`)} />

      <Button variant="accent" size="lg" className="w-full" icon={<Sparkles size={18} />} onClick={simulate}>
        {tr('จำลองการสแกน (สำหรับเดโม)', 'Simulate scan (demo)')}
      </Button>

      <Card className="p-4">
        <div className="mb-2 flex items-center gap-2 font-semibold"><Search size={18} /> {tr('ค้นหาด้วยตนเอง', 'Manual search')}</div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ชื่อ / เบอร์โทร / อีเมล / Registration ID', 'Name / phone / email / Registration ID')} aria-label="Manual search" />
        {results.length > 0 && (
          <div className="mt-2 divide-y divide-line">
            {results.map((a) => (
              <Link key={a.id} to={`/staff/scan/${a.id}`} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{a.name}</div>
                  <div className="text-xs text-muted">{a.id} · {L(ATTENDEE_TYPES[a.type])} · {a.phone}</div>
                </div>
                <CheckinBadge at={a.checkedInAt} />
                <ChevronRight size={16} className="text-muted" />
              </Link>
            ))}
          </div>
        )}
        {q.trim().length >= 2 && results.length === 0 && <div className="mt-3 text-sm text-muted">{tr('ไม่พบรายชื่อ', 'No match found')}</div>}
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{tr('เช็คอินวันนี้ (ประตู A)', "Today's check-in (Gate A)")}</div>
          <div className="text-2xl font-extrabold tabular-nums text-brand">{fmtNumber(1284 + Object.keys(checkins).length)}</div>
        </div>
        <div className="mt-3 divide-y divide-line">
          {recent.length === 0 && <div className="py-2 text-sm text-muted">{tr('ยังไม่มีการเช็คอินจากเครื่องนี้', 'No check-ins from this device yet')}</div>}
          {recent.map(({ a, at }) => (
            <div key={a!.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <div className="font-medium">{a!.name}</div>
                <div className="text-xs text-muted">{a!.id}</div>
              </div>
              <span className="tabular-nums text-muted">{new Date(at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
