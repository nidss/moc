import { useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import { CalendarPlus, CheckCircle2, Download, Info, MapPin, ScanLine } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ATTENDEE_TYPES, EVENT } from '../../data/event'
import { useAttendee } from '../../store/selectors'
import { Button, LinkButton } from '../../components/ui/Button'
import { Logo } from '../../components/Brand'
import { downloadDataUrl, downloadIcs } from '../../lib/download'

export default function RegisterSuccessPage() {
  const { id } = useParams()
  const { tr, L } = useI18n()
  const attendee = useAttendee(id)
  const qrWrap = useRef<HTMLDivElement>(null)

  if (!attendee) return <Navigate to="/register" replace />

  const downloadQr = () => {
    const canvas = qrWrap.current?.querySelector('canvas')
    if (canvas) downloadDataUrl(canvas.toDataURL('image/png'), `${attendee.id}.png`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <CheckCircle2 size={56} className="mx-auto text-success" />
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{tr('ลงทะเบียนสำเร็จ!', 'Registration Complete!')}</h1>
        <p className="mt-1 text-muted">{tr(`ส่ง QR Code ไปที่ ${attendee.email} และ SMS เรียบร้อยแล้ว`, `Your QR code was sent to ${attendee.email} and via SMS.`)}</p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[380px_1fr]">
        {/* Wallet-style ticket */}
        <div className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-[28px] bg-navy text-white shadow-2xl ring-1 ring-black/10">
            <div className="hero-bg px-6 pt-6 pb-5">
              <div className="flex items-center justify-between">
                <Logo tone="light" className="h-10" />
                <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-on-accent">{L(ATTENDEE_TYPES[attendee.type]).toUpperCase()}</span>
              </div>
              <div className="mt-5 text-xs text-white/60">EVENT</div>
              <div className="text-xl font-extrabold">MOC Expo 2026</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-[11px] text-white/60">{tr('วันที่', 'DATE')}</div><div className="font-semibold">{L(EVENT.dateLabel)}</div></div>
                <div><div className="text-[11px] text-white/60">{tr('เวลา', 'TIME')}</div><div className="font-semibold">{EVENT.hours}</div></div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-3 -left-3 size-6 rounded-full bg-bg" />
              <div className="absolute -top-3 -right-3 size-6 rounded-full bg-bg" />
              <div className="mx-6 border-t-2 border-dashed border-white/20" />
            </div>
            <div className="px-6 pt-5 pb-6">
              <div ref={qrWrap} className="mx-auto w-fit rounded-2xl bg-white p-3">
                <QRCodeCanvas value={attendee.id} size={200} level="M" marginSize={0} />
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-bold">{attendee.name}</div>
                <div className="font-mono text-sm tracking-wider text-accent">{attendee.id}</div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-white/60">
                <MapPin size={12} /> {L(EVENT.venue)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <Button variant="secondary" icon={<CalendarPlus size={18} />}
              onClick={() => downloadIcs('MOC Expo 2026', L(EVENT.venue), `Registration ID ${attendee.id}`)}>
              {tr('เพิ่มในปฏิทิน', 'Add to Calendar')}
            </Button>
            <Button variant="secondary" icon={<Download size={18} />} onClick={downloadQr}>{tr('ดาวน์โหลด QR', 'Download QR')}</Button>
            <LinkButton to="/event" variant="secondary">{tr('ดูข้อมูลงาน', 'View Event')}</LinkButton>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center gap-2 font-semibold"><Info size={18} className="text-brand" /> {tr('ขั้นตอนถัดไป', 'What happens next')}</div>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. {tr('แสดง QR Code นี้ที่จุดลงทะเบียนในวันงาน', 'Show this QR code at the registration gate')}</li>
              <li>2. {tr('เจ้าหน้าที่สแกนเพื่อเช็คอิน (ใช้เวลาไม่ถึง 3 วินาที)', 'Staff scan it to check you in (under 3 seconds)')}</li>
              <li>3. {tr('รับสายรัดข้อมือและแผนที่งาน', 'Collect your wristband and map')}</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-dashed border-brand/40 bg-brand-soft p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand">{tr('สำหรับผู้นำเสนอ', 'Presenter shortcut')}</div>
            <p className="mt-1 text-sm">{tr('สลับเป็นแอปเจ้าหน้าที่ แล้วสแกน QR นี้เพื่อสาธิตการเช็คอิน', 'Switch to the staff app and scan this QR to demo check-in.')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <LinkButton to={`/staff/scan/${attendee.id}`} icon={<ScanLine size={18} />}>{tr('จำลองการสแกน', 'Simulate scan')}</LinkButton>
              <LinkButton to="/staff/scan" variant="secondary">{tr('เปิดแอปสแกน', 'Open scanner')}</LinkButton>
            </div>
          </div>

          <p className="text-center text-sm text-muted lg:text-left">
            <Link to="/exhibitors" className="font-semibold text-brand hover:underline">{tr('สำรวจผู้ออกบูธก่อนวันงาน →', 'Explore exhibitors before the event →')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
