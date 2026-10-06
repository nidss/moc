import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ACTIVITY_INTERESTS, ATTENDEE_TYPES, CATEGORIES, OCCUPATIONS, ORG_OCCUPATIONS, PROVINCES } from '../../data/event'
import { useDemoStore } from '../../store/demoStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Chip, Field, Input, Select } from '../../components/ui/Form'
import type { AttendeeType } from '../../data/types'

type FormState = {
  name: string
  phone: string
  email: string
  age: string
  occupation: string
  organization: string
  province: string
  type: AttendeeType
  interests: string[]
  activities: string[]
  wantsMatching: boolean
  consent: boolean
}

const EMPTY: FormState = { name: '', phone: '', email: '', age: '', occupation: '', organization: '', province: '', type: 'visitor', interests: [], activities: [], wantsMatching: false, consent: false }

const SAMPLE: FormState = { name: 'สมชาย ใจดี', phone: '081-234-5678', email: 'somchai@mail.example', age: '34', occupation: 'owner', organization: 'บริษัท ใจดีฟู้ดส์ จำกัด', province: 'bkk', type: 'visitor', interests: ['food', 'health'], activities: ['shopping', 'matching'], wantsMatching: true, consent: true }

export default function RegisterPage() {
  const { tr, L } = useI18n()
  const navigate = useNavigate()
  const register = useDemoStore((s) => s.register)
  const [step, setStep] = useState<1 | 2>(1)
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((s) => ({ ...s, [k]: v }))
  // ช่องบริษัท/หน่วยงาน แสดงเฉพาะพนักงานบริษัท เจ้าของกิจการ และข้าราชการ/รัฐวิสาหกิจ
  const org = ORG_OCCUPATIONS[f.occupation]

  const toggle = (k: 'interests' | 'activities', v: string) =>
    setF((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }))

  const validate1 = () => {
    const e: typeof errors = {}
    if (f.name.trim().length < 2) e.name = tr('กรุณากรอกชื่อ-นามสกุล', 'Please enter your full name')
    if (!/^0\d{1,2}-?\d{3}-?\d{4}$/.test(f.phone.trim())) e.phone = tr('รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 081-234-5678', 'Invalid phone, e.g. 081-234-5678')
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = tr('รูปแบบอีเมลไม่ถูกต้อง', 'Invalid email address')
    if (org && f.organization.trim().length < 2) e.organization = tr(`กรุณากรอก${org.label.th}`, `Please enter your ${org.label.en.toLowerCase()}`)
    if (!f.province) e.province = tr('กรุณาเลือกจังหวัด', 'Please select a province')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!f.consent) {
      setErrors({ consent: tr('กรุณายอมรับเงื่อนไขการใช้ข้อมูล', 'Please accept the data policy') })
      return
    }
    const a = register({
      name: f.name.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      age: f.age ? Number(f.age) : undefined,
      occupation: f.occupation || undefined,
      organization: org ? f.organization.trim() : undefined,
      province: f.province,
      type: f.type,
      interests: f.interests,
      activities: f.activities,
      wantsMatching: f.wantsMatching,
    })
    navigate(`/register/success/${a.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">MOC Expo 2026</div>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{tr('ลงทะเบียนเข้าร่วมงาน', 'Event Registration')}</h1>
        <p className="mt-1 text-sm text-muted">{tr('รับ QR Code สำหรับเข้างานทันทีหลังลงทะเบียน', 'Get your entry QR code instantly')}</p>
      </div>

      {/* Stepper */}
      <ol className="mb-6 flex items-center gap-3">
        {[tr('ข้อมูลส่วนตัว', 'Personal info'), tr('ความสนใจ', 'Interests')].map((label, i) => {
          const n = i + 1
          const done = step > n
          const active = step === n
          return (
            <li key={label} className="flex flex-1 items-center gap-3">
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-success text-white' : active ? 'bg-brand text-white dark:text-[#0a1120]' : 'bg-surface-2 text-muted'}`}>
                {done ? <Check size={16} /> : n}
              </span>
              <span className={`text-sm font-semibold ${active ? '' : 'text-muted'}`}>{label}</span>
              {n === 1 && <span className="h-px flex-1 bg-line" />}
            </li>
          )
        })}
      </ol>

      <Card className="p-5 sm:p-7">
        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label={tr('ชื่อ-นามสกุล', 'Full name')} required error={errors.name}>
                <Input value={f.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" placeholder={tr('เช่น สมชาย ใจดี', 'e.g. Somchai Jaidee')} />
              </Field>
            </div>
            <Field label={tr('เบอร์โทรศัพท์', 'Phone')} required error={errors.phone}>
              <Input value={f.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" placeholder="08x-xxx-xxxx" />
            </Field>
            <Field label={tr('อีเมล', 'Email')} required error={errors.email}>
              <Input value={f.email} onChange={(e) => set('email', e.target.value)} type="email" autoComplete="email" placeholder="name@email.com" />
            </Field>
            <Field label={tr('อายุ', 'Age')}>
              <Input value={f.age} onChange={(e) => set('age', e.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="30" />
            </Field>
            <Field label={tr('อาชีพ', 'Occupation')}>
              <Select value={f.occupation} onChange={(e) => { const v = e.target.value; setF((s) => ({ ...s, occupation: v, organization: ORG_OCCUPATIONS[v] ? s.organization : '' })); setErrors((er) => ({ ...er, organization: undefined })) }}>
                <option value="">{tr('เลือกอาชีพ', 'Select occupation')}</option>
                {Object.entries(OCCUPATIONS).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
              </Select>
            </Field>
            {org && (
              <div className="sm:col-span-2">
                <Field label={L(org.label)} required error={errors.organization}>
                  <Input value={f.organization} onChange={(e) => set('organization', e.target.value)} autoComplete="organization" placeholder={L(org.placeholder)} />
                </Field>
              </div>
            )}
            <Field label={tr('จังหวัด', 'Province')} required error={errors.province}>
              <Select value={f.province} onChange={(e) => set('province', e.target.value)}>
                <option value="">{tr('เลือกจังหวัด', 'Select province')}</option>
                {Object.entries(PROVINCES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
              </Select>
            </Field>
            <Field label={tr('ประเภทผู้เข้าร่วม', 'Attendee type')}>
              <Select value={f.type} onChange={(e) => set('type', e.target.value as AttendeeType)}>
                {(['visitor', 'sme', 'buyer', 'media'] as AttendeeType[]).map((k) => <option key={k} value={k}>{L(ATTENDEE_TYPES[k])}</option>)}
              </Select>
            </Field>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => { setF(SAMPLE); setErrors({}) }} className="text-sm font-medium text-muted underline-offset-4 hover:text-brand hover:underline">
                {tr('กรอกข้อมูลตัวอย่าง (สำหรับเดโม)', 'Fill sample data (demo)')}
              </button>
              <Button onClick={() => validate1() && setStep(2)}>{tr('ถัดไป', 'Next')} <ArrowRight size={16} /></Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="mb-2 font-semibold">{tr('หมวดสินค้าที่สนใจ', 'Product categories of interest')}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORIES).map(([k, v]) => (
                  <Chip key={k} active={f.interests.includes(k)} onClick={() => toggle('interests', k)}>{L(v)}</Chip>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 font-semibold">{tr('กิจกรรมที่สนใจ', 'Activities of interest')}</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ACTIVITY_INTERESTS).map(([k, v]) => (
                  <Chip key={k} active={f.activities.includes(k)} onClick={() => toggle('activities', k)}>{L(v)}</Chip>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 hover:border-brand/50">
              <input type="checkbox" checked={f.wantsMatching} onChange={(e) => set('wantsMatching', e.target.checked)} className="mt-1 size-4 accent-[var(--brand)]" />
              <span>
                <span className="block font-semibold">{tr('ต้องการเข้าร่วม Business Matching', 'I want to join Business Matching')}</span>
                <span className="text-sm text-muted">{tr('ระบบจะแนะนำ Buyer / SME ที่ตรงกับความสนใจของคุณ', "We'll suggest buyers / SMEs that match your interests")}</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand)]" />
              <span>
                <ShieldCheck size={14} className="mr-1 inline text-success" />
                {tr('ยินยอมให้เก็บและใช้ข้อมูลตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อการจัดงาน', 'I consent to data collection under the PDPA for event purposes')}
                {errors.consent && <span className="mt-1 block text-xs text-danger">{errors.consent}</span>}
              </span>
            </label>
            <div className="flex justify-between gap-2 pt-2">
              <Button variant="secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> {tr('ย้อนกลับ', 'Back')}</Button>
              <Button variant="accent" onClick={submit}>{tr('ลงทะเบียน', 'Register')} <Check size={16} /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
