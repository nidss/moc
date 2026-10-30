import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2, Plus } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT } from '../../data/event'
import { useDemoStore } from '../../store/demoStore'
import { useExhibitor, useExhibitors } from '../../store/selectors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { DocumentsPanel, EMPTY_SHOP, LogoPanel, MarketingFields, MatchingChoice, SAMPLE_SHOP, ShopInfoFields, shopToInput, validateMarketing, validateShop, type ShopErrors, type ShopForm } from '../../components/ShopForm'
import { ProductEditor, newProduct } from '../../components/ProductEditor'
import { isProductComplete } from '../../lib/catalog'
import type { Product } from '../../data/types'

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const { tr } = useI18n()
  const labels = [tr('ข้อมูลของร้านค้าบริษัท', 'Shop / company'), tr('ข้อมูลทางด้านการตลาด/อื่นๆ', 'Marketing & other'), tr('ข้อมูลสินค้าผลิตภัณฑ์ (e-Catalog)', 'Products (e-Catalog)')]
  return (
    <ol className="grid grid-cols-3 gap-2">
      {labels.map((label, i) => {
        const n = i + 1
        const active = step === n
        return (
          <li key={label} aria-current={active ? 'step' : undefined}
            className={`rounded-xl border p-3 text-sm ${active ? 'border-brand bg-brand-soft font-semibold text-brand' : 'border-line text-muted'}`}>
            <span className={`mb-1 block font-bold ${step > n ? 'text-success' : ''}`}>{step > n ? <Check size={16} /> : n}</span>
            {label}
          </li>
        )
      })}
    </ol>
  )
}

/** ลงทะเบียนผู้ประกอบการ: ข้อมูลร้าน → การตลาด + ยืนยันลงทะเบียน → เพิ่มสินค้า (ข้ามได้) */
export default function ExhibitorRegisterPage() {
  const { tr, L } = useI18n()
  const navigate = useNavigate()
  const exhibitors = useExhibitors()
  const registerExhibitor = useDemoStore((s) => s.registerExhibitor)
  const portalLogin = useDemoStore((s) => s.portalLogin)
  const saveProduct = useDemoStore((s) => s.saveProduct)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [f, setF] = useState<ShopForm>(EMPTY_SHOP)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<ShopErrors>({})
  const [shopId, setShopId] = useState('')
  const shop = useExhibitor(shopId)
  const [draft, setDraft] = useState<Product | null>(null)
  const [saved, setSaved] = useState('')
  const [draftError, setDraftError] = useState('')

  const set = <K extends keyof ShopForm>(k: K, v: ShopForm[K]) => setF((s) => ({ ...s, [k]: v }))
  const emailTaken = (email: string) => exhibitors.some((e) => e.contact.email.toLowerCase() === email)
  const top = () => window.scrollTo(0, 0)

  const next = () => {
    const e = validateShop(f, tr, emailTaken)
    setErrors(e)
    if (Object.keys(e).length === 0) { setStep(2); top() }
  }

  const submit = () => {
    const e = validateMarketing(f, tr)
    if (!consent) e.consent = tr('กรุณายินยอมให้เก็บและใช้ข้อมูล', 'Please give consent to continue')
    setErrors(e)
    if (Object.keys(e).length) return
    const ex = registerExhibitor(shopToInput(f))
    portalLogin(ex.id)
    setShopId(ex.id)
    setDraft(newProduct(ex.id))
    setStep(3)
    top()
  }

  const saveDraft = () => {
    if (!shop || !draft) return false
    if (!draft.name.th.trim() && !draft.name.en.trim()) {
      setDraftError(tr('กรุณากรอกชื่อสินค้าอย่างน้อย 1 ภาษา', 'Please enter a product name in at least one language'))
      return false
    }
    setDraftError('')
    saveProduct(shop.id, draft)
    setSaved(L(draft.name) || draft.name.th || draft.name.en)
    return true
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-brand">MOC Expo 2026</div>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{tr('ลงทะเบียนผู้ประกอบการ', 'Exhibitor Registration')}</h1>
        <p className="mt-1 text-sm text-muted">{L(EVENT.dateLabel)} · {EVENT.hours}</p>
      </div>

      <Card className="space-y-6 p-4 sm:p-8">
        <Stepper step={step} />

        {step === 1 && (
          <>
            <h2 className="text-lg font-bold">1. {tr('ข้อมูลของร้านค้าบริษัท', 'Shop / company information')}</h2>
            <ShopInfoFields f={f} set={set} errors={errors} />
            <LogoPanel value={f.logo} onChange={(v) => set('logo', v)} />
            <DocumentsPanel value={f.documents} onChange={(v) => set('documents', v)} />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => { setF(SAMPLE_SHOP); setErrors({}) }} className="text-sm font-medium text-muted underline-offset-4 hover:text-brand hover:underline">
                {tr('กรอกข้อมูลตัวอย่าง (สำหรับเดโม)', 'Fill sample data (demo)')}
              </button>
              <Button variant="accent" onClick={next}>{tr('ถัดไป', 'Next')}</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold">2. {tr('ข้อมูลทางด้านการตลาด/อื่นๆ', 'Marketing & other information')}</h2>
            <MarketingFields f={f} set={set} errors={errors} />
            <MatchingChoice value={f.matching} onChange={(v) => set('matching', v)} error={errors.matching} />
            <div className="space-y-3 border-t border-line pt-5">
              <p className="text-sm text-muted">{tr('โปรดตรวจสอบข้อมูลทั้งหมดก่อนยืนยันลงทะเบียน · เพิ่มสินค้าได้ในขั้นตอนถัดไป หรือภายหลังที่หน้า “ร้านค้าของฉัน”', 'Please review everything before confirming · you can add products in the next step or later in “My Shop”')}</p>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand)]" />
                <span>
                  {tr('ยินยอมให้เก็บและใช้ข้อมูลเพื่อการจัดงานและจัดทำ e-CAT', 'I consent to my data being used for the event and the e-CAT')}<span className="ml-0.5 text-danger">*</span>
                  {errors.consent && <span className="mt-1 block text-xs text-danger">{errors.consent}</span>}
                </span>
              </label>
            </div>
            <div className="flex justify-between gap-2">
              <Button variant="secondary" onClick={() => { setStep(1); top() }}><ArrowLeft size={16} /> {tr('ย้อนกลับ', 'Back')}</Button>
              <Button variant="accent" icon={<Check size={16} />} onClick={submit}>{tr('ยืนยันลงทะเบียน', 'Confirm registration')}</Button>
            </div>
          </>
        )}

        {step === 3 && shop && draft && (
          <>
            <div className="flex items-start gap-3 rounded-2xl bg-success-soft p-4 text-sm">
              <CheckCircle2 size={20} className="shrink-0 text-success" />
              <div>
                <div className="font-semibold text-success">{tr('ลงทะเบียนสำเร็จ', 'Registration complete')}</div>
                <div className="mt-0.5">{tr('เพิ่มสินค้าเพื่อแสดงบน e-Catalog ได้เลย หรือข้ามไปก่อนแล้วกลับมาเพิ่มภายหลังที่หน้า “ร้านค้าของฉัน”', 'Add products to your e-Catalog now, or skip and add them later in “My Shop”')}</div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold">3. {tr('ข้อมูลสินค้าผลิตภัณฑ์ (e-Catalog)', 'Products (e-Catalog)')}</h2>
              <p className="text-sm text-muted">{tr('ข้อมูลที่กรอกจะแสดงเป็นการ์ดสินค้าบนหน้าร้านของคุณใน e-Catalog ตามตัวอย่างด้านขวา', 'What you enter becomes a product card on your e-Catalog page, as previewed on the right')}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {shop.products.map((p, i) => (
                <button key={p.id} type="button" onClick={() => { setDraft(p); setSaved('') }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${p.id === draft.id ? 'border-brand bg-brand-soft font-semibold text-brand' : 'border-line text-muted hover:border-brand/50'}`}>
                  <span className={`size-2 rounded-full ${isProductComplete(p) ? 'bg-success' : 'bg-warning'}`} />
                  {tr('สินค้า', 'Product')} {i + 1} · {L(p.name) || p.name.th || p.name.en}
                </button>
              ))}
              <button type="button" onClick={() => { setDraft(newProduct(shop.id)); setSaved('') }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-line px-3 py-2 text-sm font-semibold text-brand hover:border-brand/50">
                <Plus size={16} /> {tr('เพิ่มสินค้า', 'Add product')}
              </button>
            </div>
            {saved && <div role="status" className="rounded-xl bg-brand-soft p-3 text-sm">{tr(`บันทึก “${saved}” แล้ว`, `Saved “${saved}”`)}</div>}
            {draftError && <div role="alert" className="rounded-xl border border-danger p-3 text-sm text-danger">{draftError}</div>}
            <ProductEditor value={draft} onChange={setDraft} shop={shop} />
            <div className="flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={() => navigate('/portal')}>{tr('ข้ามไปก่อน เพิ่มทีหลังได้', 'Skip for now, add later')}</Button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" icon={<Plus size={16} />} onClick={() => { if (saveDraft()) setDraft(newProduct(shop.id)) }}>{tr('บันทึกแล้วเพิ่มสินค้าอีก', 'Save and add another')}</Button>
                <Button variant="accent" icon={<Check size={16} />} onClick={() => { if (saveDraft()) navigate('/portal/products') }}>{tr('บันทึกสินค้า และไปที่ร้านค้าของฉัน', 'Save and go to My Shop')}</Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
