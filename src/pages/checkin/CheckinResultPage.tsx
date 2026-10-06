import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, ScanLine, XCircle } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ATTENDEE_TYPES, PROVINCES } from '../../data/event'
import { useAttendee } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import { Card } from '../../components/ui/Card'
import { Button, LinkButton } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export default function CheckinResultPage() {
  const { id = '' } = useParams()
  const { tr, L, fmtDate } = useI18n()
  const attendee = useAttendee(decodeURIComponent(id))
  const checkIn = useDemoStore((s) => s.checkIn)
  // จำสถานะตอนเปิดหน้า เพื่อแยก "เพิ่งเช็คอินสำเร็จ" ออกจาก "เคยเช็คอินแล้ว"
  const [alreadyAt] = useState(attendee?.checkedInAt)
  const [justDone, setJustDone] = useState(false)

  if (!attendee) {
    return (
      <Card className="p-8 text-center">
        <XCircle size={64} className="mx-auto text-danger" />
        <h1 className="mt-3 text-2xl font-bold">{tr('QR ไม่ถูกต้อง', 'Invalid QR code')}</h1>
        <p className="mt-1 text-muted">{tr('ไม่พบรหัส', 'No registration found for')} <span className="font-mono">{decodeURIComponent(id)}</span></p>
        <LinkButton to="/staff/scan" className="mt-6" icon={<ScanLine size={18} />}>{tr('สแกนใหม่', 'Scan again')}</LinkButton>
      </Card>
    )
  }

  const state = justDone ? 'done' : alreadyAt ? 'duplicate' : 'ready'

  return (
    <div className="space-y-4">
      <Card className={`overflow-hidden ${state === 'done' ? 'ring-2 ring-success' : state === 'duplicate' ? 'ring-2 ring-warning' : ''}`}>
        <div className={`px-6 py-8 text-center ${state === 'done' ? 'bg-success-soft' : state === 'duplicate' ? 'bg-warning-soft' : 'bg-brand-soft'}`}>
          {state === 'done' && <CheckCircle2 size={72} className="mx-auto text-success" />}
          {state === 'duplicate' && <AlertTriangle size={72} className="mx-auto text-warning" />}
          {state === 'ready' && <ScanLine size={72} className="mx-auto text-brand" />}
          <h1 className="mt-3 text-2xl font-extrabold">
            {state === 'done' && tr('เช็คอินสำเร็จ', 'Check-in Successful')}
            {state === 'duplicate' && tr('เช็คอินแล้วก่อนหน้านี้', 'Already checked in')}
            {state === 'ready' && tr('QR ถูกต้อง', 'Valid QR code')}
          </h1>
          {state === 'duplicate' && alreadyAt && (
            <p className="mt-1 text-sm text-warning">{tr('เมื่อ', 'at')} {fmtDate(alreadyAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
          )}
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="text-xs text-muted">{tr('ชื่อ', 'Name')}</div>
            <div className="text-2xl font-bold">{attendee.name}</div>
          </div>
          <div>
            <div className="text-xs text-muted">Registration ID</div>
            <div className="font-mono font-semibold">{attendee.id}</div>
          </div>
          <div>
            <div className="text-xs text-muted">{tr('ประเภท', 'Type')}</div>
            <Badge tone="brand" className="mt-1 text-sm">{L(ATTENDEE_TYPES[attendee.type])}</Badge>
          </div>
          <div>
            <div className="text-xs text-muted">{tr('จังหวัด', 'Province')}</div>
            <div className="font-semibold">{L(PROVINCES[attendee.province] ?? { th: '-', en: '-' })}</div>
          </div>
          <div>
            <div className="text-xs text-muted">{tr('โทรศัพท์', 'Phone')}</div>
            <div className="font-semibold">{attendee.phone}</div>
          </div>
        </div>
      </Card>

      {state === 'ready' ? (
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <LinkButton to="/staff/scan" variant="secondary" size="lg">{tr('ยกเลิก', 'Cancel')}</LinkButton>
          <Button variant="success" size="lg" icon={<CheckCircle2 size={20} />} onClick={() => { checkIn(attendee.id); setJustDone(true) }}>
            {tr('ยืนยันเช็คอิน', 'Confirm Check-in')}
          </Button>
        </div>
      ) : (
        <LinkButton to="/staff/scan" size="lg" className="w-full" icon={<ScanLine size={20} />}>{tr('สแกนคนถัดไป', 'Scan next')}</LinkButton>
      )}
    </div>
  )
}
