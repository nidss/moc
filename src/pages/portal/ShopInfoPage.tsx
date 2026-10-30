import { useState } from 'react'
import { Check } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemoStore } from '../../store/demoStore'
import { useExhibitors, usePortalMe } from '../../store/selectors'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { DocumentsPanel, LogoPanel, MarketingFields, ShopInfoFields, shopFromExhibitor, shopToInput, validateMarketing, validateShop, type ShopErrors, type ShopForm } from '../../components/ShopForm'

/** แก้ไขข้อมูลร้าน ใช้ฟอร์มชุดเดียวกับขั้นตอนที่ 1–2 ของการลงทะเบียน */
export default function ShopInfoPage() {
  const { tr } = useI18n()
  const me = usePortalMe()
  const exhibitors = useExhibitors()
  const updateShop = useDemoStore((s) => s.updateShop)
  const [f, setF] = useState<ShopForm>(() => shopFromExhibitor(me))
  const [errors, setErrors] = useState<ShopErrors>({})
  const [saved, setSaved] = useState(false)

  const original = shopFromExhibitor(me)
  const dirty = (Object.keys(f) as (keyof ShopForm)[]).filter((k) => JSON.stringify(f[k]) !== JSON.stringify(original[k])).length
  const set = <K extends keyof ShopForm>(k: K, v: ShopForm[K]) => { setF((s) => ({ ...s, [k]: v })); setSaved(false) }

  const save = () => {
    const e = { ...validateShop(f, tr, (email) => exhibitors.some((x) => x.id !== me.id && x.contact.email.toLowerCase() === email)), ...validateMarketing(f, tr) }
    setErrors(e)
    if (Object.keys(e).length) return window.scrollTo({ top: 0, behavior: 'smooth' })
    const input = shopToInput(f, me)
    updateShop(me.id, { ...input, brand: input.name.en })
    setSaved(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="hidden space-y-1 text-sm lg:sticky lg:top-24 lg:block lg:self-start">
        {[['shop-info', tr('ข้อมูลของร้านค้าบริษัท', 'Shop / company')], ['shop-logo', tr('โลโก้ร้าน', 'Logo')], ['shop-marketing', tr('ข้อมูลทางด้านการตลาด', 'Marketing')], ['shop-matching', 'Business Matching'], ['shop-docs', tr('เอกสารประกอบ', 'Documents')]].map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            className="block rounded-lg px-3 py-2 text-muted hover:bg-surface-2 hover:text-fg">{label}</a>
        ))}
        <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs leading-relaxed text-muted">{tr('ชื่อร้าน โลโก้ และลิงก์ จะแสดงบนหน้าร้าน e-Catalog ทันทีที่บันทึก', 'Name, logo and links appear on your e-Catalog page as soon as you save')}</p>
      </nav>

      <div className="space-y-6">
        <Card id="shop-info" className="scroll-mt-24 p-5 sm:p-6">
          <h2 className="text-lg font-bold">{tr('ข้อมูลของร้านค้าบริษัท', 'Shop / company information')}</h2>
          <p className="mb-4 text-sm text-muted">{tr('แก้ไขได้ตลอดก่อนวันงาน', 'Editable until the event')}</p>
          <ShopInfoFields f={f} set={set} errors={errors} />
        </Card>
        <div id="shop-logo" className="scroll-mt-24"><LogoPanel value={f.logo} name={f.logoName} onChange={(v, n) => { set('logo', v); set('logoName', n) }} /></div>
        <Card id="shop-marketing" className="scroll-mt-24 p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">{tr('ข้อมูลทางด้านการตลาด/อื่นๆ', 'Marketing & other information')}</h2>
          <MarketingFields f={f} set={set} errors={errors} />
        </Card>
        <Card id="shop-matching" className="scroll-mt-24 p-5 sm:p-6">
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block text-lg font-bold">{tr('เข้าร่วม Business Matching', 'Join Business Matching')}</span>
              <span className="mt-0.5 block text-sm text-muted">{tr('เปิดเพื่อค้นหา Buyer และขอนัดเจรจาธุรกิจในงาน · ปิดแล้วนัดหมายที่มีอยู่จะยังไม่ถูกยกเลิก', 'Turn on to find buyers and book meetings · turning it off keeps existing meetings')}</span>
            </span>
            <input type="checkbox" role="switch" checked={!!f.matching} onChange={(e) => set('matching', e.target.checked)}
              className="relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-line transition-colors before:absolute before:top-0.5 before:left-0.5 before:size-5 before:rounded-full before:bg-white before:shadow before:transition-transform checked:bg-brand checked:before:translate-x-5" />
          </label>
        </Card>
        <div id="shop-docs" className="scroll-mt-24"><DocumentsPanel value={f.documents} onChange={(v) => set('documents', v)} /></div>

        <Card className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 p-4 shadow-lg">
          <span className="flex items-center gap-2 text-sm text-muted">
            {saved ? <><Check size={16} className="text-success" /> {tr('บันทึกแล้ว', 'Saved')}</>
              : dirty ? <><span className="size-2 rounded-full bg-warning" /> {tr(`มีการแก้ไขที่ยังไม่บันทึก ${dirty} รายการ`, `${dirty} unsaved change(s)`)}</>
              : tr('ข้อมูลเป็นปัจจุบัน', 'Up to date')}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={!dirty} onClick={() => { setF(original); setErrors({}) }}>{tr('ยกเลิก', 'Discard')}</Button>
            <Button variant="accent" icon={<Check size={16} />} disabled={!dirty} onClick={save}>{tr('บันทึกการเปลี่ยนแปลง', 'Save changes')}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
