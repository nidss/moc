import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Mail, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT } from '../../data/event'
import { DEMO_SME_ID } from '../../data/exhibitors'
import { useDemoStore } from '../../store/demoStore'
import { useExhibitors } from '../../store/selectors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Form'

/** รหัส OTP สำหรับเดโม (ไม่มีการส่งอีเมล / SMS จริง) */
const DEMO_OTP = '246810'

const mask = (v: string) => v.includes('@')
  ? v.replace(/^(.{3}).*(@.*)$/, '$1•••$2')
  : v.replace(/^(\d{3}).*(\d{4})$/, '$1-•••-$2')

export default function PortalLoginPage() {
  const { tr, L } = useI18n()
  const navigate = useNavigate()
  const exhibitors = useExhibitors()
  const portalId = useDemoStore((s) => s.portalId)
  const portalLogin = useDemoStore((s) => s.portalLogin)
  const [mode, setMode] = useState<'email' | 'phone'>('email')
  const [id, setId] = useState('')
  const [otp, setOtp] = useState('')
  const [sentTo, setSentTo] = useState<string>()
  const [error, setError] = useState('')

  if (portalId && exhibitors.some((e) => e.id === portalId)) return <Navigate to="/portal" replace />

  const digits = (v: string) => v.replace(/\D/g, '')
  const shop = sentTo ? exhibitors.find((e) => e.id === sentTo) : undefined

  const send = () => {
    const v = id.trim().toLowerCase()
    const found = exhibitors.find((e) => mode === 'email' ? e.contact.email.toLowerCase() === v : digits(e.contact.phone) === digits(v))
    if (!found) {
      setError(mode === 'email'
        ? tr('ไม่พบร้านค้าที่ลงทะเบียนด้วยอีเมลนี้', 'No shop is registered with this email')
        : tr('ไม่พบร้านค้าที่ลงทะเบียนด้วยเบอร์นี้', 'No shop is registered with this phone number'))
      return
    }
    setError('')
    setOtp('')
    setSentTo(found.id)
  }

  const verify = () => {
    if (!shop) return
    if (otp !== DEMO_OTP) return setError(tr('รหัส OTP ไม่ถูกต้อง', 'Incorrect OTP'))
    portalLogin(shop.id)
    navigate('/portal')
  }

  const perks = [
    [tr('จัดการข้อมูลร้านและสินค้าบน e-Catalog', 'Manage your shop & e-Catalog'), tr('เพิ่ม แก้ไข ซ่อนสินค้าได้ตลอดก่อนวันงาน', 'Add, edit or hide products any time before the event')],
    ['Business Matching', tr('ค้นหา Buyer และนัดหมายเจรจาธุรกิจ', 'Find buyers and book meetings')],
    [tr('ผู้เยี่ยมชมบูธ', 'Booth visitors'), tr('สแกน QR ผู้เข้างานและ Export รายชื่อ', 'Scan visitor QR tickets and export leads')],
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <Card className="grid overflow-hidden md:grid-cols-[400px_1fr]">
        <div className="flex flex-col bg-navy p-7 text-white/80 sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">MOC Expo 2026 · SME Portal</div>
          <h2 className="mt-2 text-2xl font-bold text-white">{tr('พื้นที่สำหรับผู้ประกอบการ', 'For exhibitors')}</h2>
          <p className="mt-2 text-sm">{tr('เข้าสู่ระบบด้วยอีเมลหรือเบอร์โทรศัพท์ที่ใช้ลงทะเบียนร้านค้า', 'Log in with the email or phone you registered your shop with')}</p>
          <ul className="mt-8 space-y-5">
            {perks.map(([t, d]) => (
              <li key={t} className="flex items-start gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                <div><div className="font-semibold text-white">{t}</div><div className="text-sm">{d}</div></div>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-10">
            <div className="gold-gradient h-1 w-16 rounded-full" />
            <p className="mt-3 text-xs text-white/60">{L(EVENT.dateLabel)} · {L(EVENT.venue)}</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-sm">
            {!shop ? (
              <>
                <h1 className="text-2xl font-bold">{tr('เข้าสู่ระบบร้านค้า', 'Shop login')}</h1>
                <p className="mt-1 text-sm text-muted">{tr('ไม่ต้องตั้งรหัสผ่าน ระบบจะส่งรหัส OTP ให้ทุกครั้งที่เข้าสู่ระบบ', 'No password needed — we send a one-time code each time you log in')}</p>
                <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-surface-2 p-1" role="tablist">
                  {(['email', 'phone'] as const).map((m) => (
                    <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setId(''); setError('') }}
                      className={`rounded-lg py-1.5 text-sm font-semibold ${mode === m ? 'bg-surface text-brand shadow-sm' : 'text-muted'}`}>
                      {m === 'email' ? tr('อีเมล', 'Email') : tr('เบอร์โทรศัพท์', 'Phone')}
                    </button>
                  ))}
                </div>
                <form className="mt-5 space-y-5" onSubmit={(e) => { e.preventDefault(); send() }}>
                  <Field label={mode === 'email' ? tr('อีเมลที่ใช้ลงทะเบียน', 'Registered email') : tr('เบอร์โทรที่ใช้ลงทะเบียน', 'Registered phone')} required error={error}>
                    <Input value={id} onChange={(e) => setId(e.target.value)} type={mode === 'email' ? 'email' : 'tel'} autoComplete={mode === 'email' ? 'email' : 'tel'}
                      placeholder={mode === 'email' ? 'name@company.co.th' : '081-234-5678'} />
                  </Field>
                  <Button type="submit" variant="accent" className="w-full" icon={<Mail size={16} />}>{tr('ส่งรหัส OTP', 'Send OTP')}</Button>
                </form>
                <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />{tr('หรือ', 'or')}<span className="h-px flex-1 bg-line" /></div>
                <Button variant="secondary" className="w-full" icon={<ShieldCheck size={16} />} onClick={() => { portalLogin(DEMO_SME_ID); navigate('/portal') }}>
                  {tr('เข้าสู่ระบบด้วย SME ONE ID', 'Log in with SME ONE ID')}
                </Button>
                <button type="button" onClick={() => { setMode('email'); setId(exhibitors.find((e) => e.id === DEMO_SME_ID)?.contact.email ?? ''); setError('') }}
                  className="mt-3 w-full text-center text-sm font-medium text-muted underline-offset-4 hover:text-brand hover:underline">
                  {tr('ใช้บัญชีร้านตัวอย่าง (สำหรับเดโม)', 'Use the sample shop account (demo)')}
                </button>
                <p className="mt-8 text-center text-sm text-muted">
                  {tr('ยังไม่ได้ลงทะเบียน?', 'Not registered yet?')} <Link to="/register/exhibitor" className="font-semibold text-brand hover:underline">{tr('ลงทะเบียนผู้ประกอบการ', 'Register as an exhibitor')}</Link>
                </p>
              </>
            ) : (
              <>
                <button type="button" onClick={() => { setSentTo(undefined); setError('') }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  <ArrowLeft size={16} /> {mode === 'email' ? tr('เปลี่ยนอีเมล', 'Change email') : tr('เปลี่ยนเบอร์โทร', 'Change phone')}
                </button>
                <h1 className="mt-4 text-2xl font-bold">{tr('กรอกรหัส OTP', 'Enter OTP')}</h1>
                <p className="mt-1 text-sm text-muted">
                  {tr('ส่งรหัส 6 หลักไปที่', 'We sent a 6-digit code to')} <span className="font-semibold text-fg">{mask(mode === 'email' ? shop.contact.email : shop.contact.phone)}</span> · {tr('รหัสมีอายุ 5 นาที', 'valid for 5 minutes')}
                </p>
                <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); verify() }}>
                  <Field label={tr('รหัส OTP', 'OTP code')} required error={error}>
                    <Input value={otp} onChange={(e) => setOtp(digits(e.target.value).slice(0, 6))} inputMode="numeric" autoComplete="one-time-code"
                      className="text-center text-2xl font-bold tracking-[0.5em]" placeholder="••••••" autoFocus />
                  </Field>
                  <div className="rounded-xl bg-accent-soft p-3 text-sm text-gold-text">{tr('โหมดเดโม: ใช้รหัส', 'Demo mode: use code')} <b className="tabular-nums">{DEMO_OTP}</b></div>
                  <Button type="submit" variant="accent" className="w-full" icon={<Check size={16} />} disabled={otp.length !== 6}>{tr('ยืนยันและเข้าสู่ระบบ', 'Verify and log in')}</Button>
                </form>
                <div className="mt-6 rounded-xl bg-surface-2 p-4 text-sm text-muted">
                  {tr('พบร้านค้าที่ลงทะเบียนด้วยข้อมูลนี้', 'Shop found for this login')}: <span className="font-semibold text-fg">{L(shop.name)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
