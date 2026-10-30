import { useState, type ReactNode } from 'react'
import { FileText, ImagePlus, Trash2 } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { AGENCIES, CATEGORIES, PROVINCES, SHOP_TYPES } from '../data/event'
import { Field, Input, Select } from './ui/Form'
import { readImage } from '../lib/image'
import type { ExhibitorInput } from '../store/demoStore'
import type { CategoryId, Exhibitor, ShopType } from '../data/types'

/** ข้อมูลร้านที่ใช้ร่วมกันระหว่างฟอร์มลงทะเบียนผู้ประกอบการและแท็บ "ข้อมูลร้านค้า" ใน SME Portal */
export type ShopForm = {
  nameTh: string
  nameEn: string
  owner: string
  contactName: string
  phone: string
  email: string
  category: CategoryId
  shopType: ShopType
  agency: string
  province: string
  logo: string
  documents: string[]
  website: string
  line: string
  facebook: string
  matching: boolean | null
}

export type ShopErrors = Partial<Record<keyof ShopForm | 'consent', string>>

export const EMPTY_SHOP: ShopForm = {
  nameTh: '', nameEn: '', owner: '', contactName: '', phone: '', email: '', category: 'food', shopType: 'general', agency: '',
  province: '', logo: '', documents: [], website: '', line: '', facebook: '', matching: null,
}

export const SAMPLE_SHOP: ShopForm = {
  nameTh: 'บริษัท ล้านนาคอฟฟี่โรสเตอร์ จำกัด', nameEn: 'Lanna Coffee Roaster Co., Ltd.', owner: 'สมชาย ใจดี', contactName: 'สมหญิง รักงาน',
  phone: '081-234-5678', email: 'contact@lannaroaster.example', category: 'food', shopType: 'general', agency: 'DBD', province: 'cmi',
  logo: '', documents: [], website: 'https://lannaroaster.example', line: '@lannaroaster', facebook: 'https://facebook.com/lannaroaster', matching: true,
}

export function shopFromExhibitor(ex: Exhibitor): ShopForm {
  return {
    nameTh: ex.name.th, nameEn: ex.name.en, owner: ex.owner ?? '', contactName: ex.contact.name, phone: ex.contact.phone, email: ex.contact.email,
    category: ex.category, shopType: ex.shopType ?? 'general', agency: ex.agency ?? '', province: ex.province, logo: ex.logo,
    documents: ex.documents ?? [], website: ex.stores.website ?? '', line: ex.contact.line, facebook: ex.social.facebook ?? '', matching: ex.matching,
  }
}

export function shopToInput(f: ShopForm, base?: Exhibitor): ExhibitorInput {
  return {
    name: { th: f.nameTh.trim(), en: f.nameEn.trim() },
    owner: f.owner.trim(),
    shopType: f.shopType,
    category: f.category,
    province: f.province,
    agency: f.agency || undefined,
    logo: f.logo,
    contact: { name: f.contactName.trim(), phone: f.phone.trim(), email: f.email.trim(), line: f.line.trim() },
    social: { ...base?.social, facebook: f.facebook.trim() || undefined },
    stores: { ...base?.stores, website: f.website.trim() || undefined },
    matching: f.matching ?? false,
    documents: f.documents,
  }
}

const URL_RE = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i

type Tr = (th: string, en: string) => string

/** ตรวจข้อมูลร้าน (ขั้นตอนที่ 1) · emailTaken ใช้กันอีเมลซ้ำกับร้านอื่น เพราะอีเมลใช้เข้าสู่ระบบ */
export function validateShop(f: ShopForm, tr: Tr, emailTaken: (email: string) => boolean): ShopErrors {
  const e: ShopErrors = {}
  if (f.nameTh.trim().length < 2) e.nameTh = tr('กรุณากรอกชื่อร้านค้า / บริษัท (ไทย)', 'Please enter the Thai shop / company name')
  if (f.nameEn.trim().length < 2) e.nameEn = tr('กรุณากรอกชื่อร้าน / บริษัท (อังกฤษ)', 'Please enter the English shop / company name')
  if (f.owner.trim().length < 2) e.owner = tr('กรุณากรอกชื่อผู้ประกอบการ', 'Please enter the owner name')
  if (f.contactName.trim().length < 2) e.contactName = tr('กรุณากรอกชื่อผู้ติดต่อ', 'Please enter a contact person')
  if (!/^0\d{1,2}-?\d{3}-?\d{4}$/.test(f.phone.trim())) e.phone = tr('รูปแบบเบอร์โทรไม่ถูกต้อง เช่น 081-234-5678', 'Invalid phone, e.g. 081-234-5678')
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = tr('รูปแบบอีเมลไม่ถูกต้อง', 'Invalid email address')
  else if (emailTaken(f.email.trim().toLowerCase())) e.email = tr('อีเมลนี้ลงทะเบียนร้านค้าไว้แล้ว กรุณาเข้าสู่ระบบ', 'This email is already registered. Please log in')
  if (!f.province) e.province = tr('กรุณาเลือกจังหวัด', 'Please select a province')
  return e
}

/** ตรวจข้อมูลการตลาด (ขั้นตอนที่ 2) */
export function validateMarketing(f: ShopForm, tr: Tr): ShopErrors {
  const e: ShopErrors = {}
  if (f.website.trim() && !URL_RE.test(f.website.trim())) e.website = tr('รูปแบบลิงก์ไม่ถูกต้อง', 'Invalid link')
  if (f.facebook.trim() && !URL_RE.test(f.facebook.trim())) e.facebook = tr('รูปแบบลิงก์ไม่ถูกต้อง', 'Invalid link')
  if (f.matching === null) e.matching = tr('กรุณาเลือกการเข้าร่วม Business Matching', 'Please choose whether to join Business Matching')
  return e
}

type Props = { f: ShopForm; set: <K extends keyof ShopForm>(k: K, v: ShopForm[K]) => void; errors: ShopErrors }

export function ShopInfoFields({ f, set, errors }: Props) {
  const { tr, L } = useI18n()
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label={tr('ชื่อร้านค้า / บริษัท (ไทย)', 'Shop / company name (Thai)')} required error={errors.nameTh}>
        <Input value={f.nameTh} maxLength={255} onChange={(e) => set('nameTh', e.target.value)} />
      </Field>
      <Field label={tr('ชื่อร้าน / บริษัท (อังกฤษ)', 'Shop / company name (English)')} required error={errors.nameEn}>
        <Input value={f.nameEn} maxLength={255} onChange={(e) => set('nameEn', e.target.value)} />
      </Field>
      <Field label={tr('ชื่อผู้ประกอบการ', 'Owner name')} required error={errors.owner}>
        <Input value={f.owner} onChange={(e) => set('owner', e.target.value)} />
      </Field>
      <Field label={tr('ผู้ติดต่อ', 'Contact person')} required error={errors.contactName}>
        <Input value={f.contactName} onChange={(e) => set('contactName', e.target.value)} />
      </Field>
      <Field label={tr('เบอร์โทรศัพท์', 'Phone')} required error={errors.phone}>
        <Input value={f.phone} inputMode="tel" autoComplete="tel" placeholder="081-234-5678" onChange={(e) => set('phone', e.target.value)} />
      </Field>
      <Field label={tr('อีเมล', 'Email')} required error={errors.email} hint={tr('ใช้สำหรับเข้าสู่ระบบร้านค้าด้วยรหัส OTP', 'Used to log in to your shop with an OTP')}>
        <Input value={f.email} type="email" autoComplete="email" placeholder="name@company.co.th" onChange={(e) => set('email', e.target.value)} />
      </Field>
      <Field label={tr('ประเภทสินค้า', 'Product category')} required>
        <Select value={f.category} onChange={(e) => set('category', e.target.value as CategoryId)}>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
        </Select>
      </Field>
      <Field label={tr('ประเภทร้าน', 'Shop type')} required>
        <Select value={f.shopType} onChange={(e) => set('shopType', e.target.value as ShopType)}>
          {Object.entries(SHOP_TYPES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
        </Select>
      </Field>
      <Field label={tr('หน่วยงานที่สังกัด', 'Affiliated agency')}>
        <Select value={f.agency} onChange={(e) => set('agency', e.target.value)}>
          <option value="">{tr('ไม่มีหน่วยงานที่สังกัด', 'No affiliated agency')}</option>
          {Object.entries(AGENCIES).map(([k, v]) => <option key={k} value={k}>{L(v.name)}</option>)}
        </Select>
      </Field>
      <Field label={tr('จังหวัด', 'Province')} required error={errors.province}>
        <Select value={f.province} onChange={(e) => set('province', e.target.value)}>
          <option value="">{tr('เลือกจังหวัด', 'Select province')}</option>
          {Object.entries(PROVINCES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
        </Select>
      </Field>
    </div>
  )
}

/** กล่องแนบไฟล์แบบเดียวกันทั้งโลโก้และเอกสาร */
function UploadPanel({ title, desc, children }: { title: ReactNode; desc: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-line bg-surface-2 p-4 sm:p-5">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
      </div>
      {children}
    </section>
  )
}

const fileBtn = 'inline-flex h-9 shrink-0 cursor-pointer items-center rounded-lg bg-brand-soft px-3 text-sm font-semibold text-brand hover:brightness-95'

export function LogoPanel({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { tr } = useI18n()
  const [error, setError] = useState('')
  const pick = async (file?: File) => {
    if (!file) return
    setError('')
    if (file.size > 5 * 1024 * 1024) return setError(tr('ไฟล์ใหญ่เกิน 5 MB', 'File is larger than 5 MB'))
    try {
      onChange(await readImage(file, 320))
    } catch {
      setError(tr('ไม่สามารถอ่านไฟล์รูปนี้ได้', 'Could not read this image'))
    }
  }
  return (
    <UploadPanel title={tr('โลโก้บริษัท / โลโก้สินค้า', 'Company / product logo')}
      desc={tr('ไม่บังคับ · แสดงเป็นโลโก้ร้านบนหน้า e-Catalog และการ์ดผู้ประกอบการ', 'Optional · shown as your shop logo on the e-Catalog and exhibitor cards')}>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2">
        {value
          ? <img src={value} alt="" className="size-16 rounded-xl border border-line bg-white object-contain p-1" />
          : <span className="flex size-16 items-center justify-center rounded-xl border border-dashed border-line text-muted"><ImagePlus size={20} /></span>}
        <span className="min-w-0 flex-1 text-sm text-muted">{value ? tr('แนบโลโก้แล้ว', 'Logo attached') : tr('ยังไม่ได้แนบรูป', 'No image yet')}</span>
        {value && <button type="button" onClick={() => onChange('')} className="px-2 text-sm font-semibold text-danger">{tr('ลบ', 'Remove')}</button>}
        <label className={fileBtn}>
          {value ? tr('เปลี่ยนรูป', 'Change') : tr('เลือกไฟล์', 'Choose file')}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = '' }} />
        </label>
      </div>
      <span className={`block text-sm ${error ? 'text-danger' : 'text-muted'}`}>{error || tr('ไฟล์เดียว · JPG, PNG หรือ WebP · ไม่เกิน 5 MB · แนะนำภาพสี่เหลี่ยมจัตุรัส', 'Single file · JPG, PNG or WebP · up to 5 MB · square images work best')}</span>
    </UploadPanel>
  )
}

export function DocumentsPanel({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const { tr } = useI18n()
  const add = (files: FileList | null) => {
    if (!files) return
    // เดโมเก็บเฉพาะชื่อไฟล์ ระบบจริงต้องอัปโหลดไปที่ storage ที่จำกัดสิทธิ์ผู้จัดงาน
    const names = Array.from(files).filter((f) => f.size <= 5 * 1024 * 1024).map((f) => f.name)
    onChange([...value, ...names].slice(0, 10))
  }
  return (
    <UploadPanel title={tr('เอกสารประกอบร้านค้า / บริษัท', 'Shop / company documents')}
      desc={tr('ไม่บังคับ · หนังสือรับรองหรือเอกสารประกอบบริษัท · เฉพาะผู้จัดงานที่มีสิทธิ์เท่านั้นที่เปิดดูได้ ไม่แสดงบนหน้าเว็บสาธารณะ', 'Optional · company certificate or supporting documents · visible to authorised organisers only, never shown publicly')}>
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2">
        <label className={fileBtn}>
          {tr('เลือกไฟล์', 'Choose files')}
          <input type="file" multiple accept="image/png,image/jpeg,image/webp,application/pdf,.pdf" className="sr-only" onChange={(e) => { add(e.target.files); e.target.value = '' }} />
        </label>
        <span className="text-sm text-muted">{value.length ? tr(`แนบแล้ว ${value.length} ไฟล์`, `${value.length} file(s) attached`) : tr('ยังไม่ได้เลือกไฟล์', 'No files chosen')}</span>
      </div>
      {value.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {value.map((name, i) => (
            <div key={`${name}-${i}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
              <FileText size={18} className="shrink-0 text-brand" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</span>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-danger" aria-label={tr(`ลบ ${name}`, `Remove ${name}`)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
      <span className="block text-sm text-muted">{tr('เพิ่มได้หลายไฟล์ สูงสุด 10 ไฟล์ · JPG, PNG, WebP, PDF · ไม่เกิน 5 MB ต่อไฟล์', 'Up to 10 files · JPG, PNG, WebP, PDF · max 5 MB each')}</span>
    </UploadPanel>
  )
}

export function MarketingFields({ f, set, errors }: Props) {
  const { tr } = useI18n()
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Website" error={errors.website}>
        <Input value={f.website} type="url" placeholder="https://example.com" onChange={(e) => set('website', e.target.value)} />
      </Field>
      <Field label="Line ID">
        <Input value={f.line} placeholder="@yourshop" onChange={(e) => set('line', e.target.value)} />
      </Field>
      <Field label="Facebook" error={errors.facebook} hint={tr('ลิงก์จะแสดงบนหน้าร้าน e-Catalog', 'Links are shown on your e-Catalog page')}>
        <Input value={f.facebook} type="url" placeholder="https://www.facebook.com/yourpage" onChange={(e) => set('facebook', e.target.value)} />
      </Field>
    </div>
  )
}

export function MatchingChoice({ value, onChange, error }: { value: boolean | null; onChange: (v: boolean) => void; error?: string }) {
  const { tr } = useI18n()
  const options: [boolean, string][] = [[true, tr('✅ สามารถเข้าร่วม', '✅ I can join')], [false, tr('❌ ไม่สามารถเข้าร่วมได้', '❌ I cannot join')]]
  return (
    <fieldset className="space-y-3 rounded-2xl border border-line bg-surface-2 p-4">
      <legend className="px-2 text-base font-semibold">{tr('สามารถเข้าร่วมเจรจาจับคู่ธุรกิจ (Business Matching)', 'Can you join Business Matching?')}</legend>
      {options.map(([v, label]) => (
        <label key={String(v)} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border bg-surface p-4 ${value === v ? 'border-brand ring-2 ring-brand/20' : 'border-line'}`}>
          <input type="radio" name="business-matching" checked={value === v} onChange={() => onChange(v)} className="size-5 shrink-0 accent-[var(--brand)]" />
          <span>{label}</span>
        </label>
      ))}
      {error && <span className="block text-xs text-danger">{error}</span>}
    </fieldset>
  )
}
