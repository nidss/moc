import { useState, type ReactNode } from 'react'
import { ExternalLink, ImagePlus } from 'lucide-react'
import { useI18n, type Lang } from '../i18n/I18nProvider'
import { Card } from './ui/Card'
import { Field, Input } from './ui/Form'
import { ProductArt } from './Brand'
import { readImage } from '../lib/image'
import type { Exhibitor, Product } from '../data/types'

export function newProduct(exhibitorId: string): Product {
  return { id: `${exhibitorId}-p${Date.now().toString(36)}`, image: '', name: { th: '', en: '' }, price: 0, unit: { th: '', en: '' }, channels: [] }
}

const langDone = (p: Product, l: Lang) => !!(p.name[l].trim() && p.unit[l].trim())

function Num({ n }: { n: number }) {
  return <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white dark:text-[#0a1120]">{n}</span>
}

function NumLabel({ n, children, hint, required }: { n: number; children: ReactNode; hint?: ReactNode; required?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <Num n={n} />
      {children}
      {required && <span className="-ml-1.5 text-danger">*</span>}
      {hint && <span className="text-xs font-normal text-muted">· {hint}</span>}
    </span>
  )
}

/**
 * ฟอร์มสินค้า + ตัวอย่างการ์ดบน e-Catalog
 * เลขบนช่องกรอกตรงกับเลขบนการ์ด เพื่อให้ร้านเห็นว่าข้อมูลแต่ละช่องไปแสดงตรงไหน
 */
export function ProductEditor({ value, onChange, shop }: { value: Product; onChange: (p: Product) => void; shop: Pick<Exhibitor, 'id' | 'category' | 'color'> }) {
  const { tr, lang: uiLang, fmtMoney } = useI18n()
  // ภาษาของการ์ดตัวอย่างเท่านั้น ช่องกรอกแสดงทั้ง 2 ภาษาพร้อมกัน
  const [lang, setLang] = useState<Lang>(uiLang)
  const [imgError, setImgError] = useState('')
  const set = (patch: Partial<Product>) => onChange({ ...value, ...patch })
  const setText = (k: 'name' | 'unit', l: Lang, v: string) => set({ [k]: { ...value[k], [l]: v } })

  const upload = async (file?: File) => {
    if (!file) return
    setImgError('')
    if (file.size > 5 * 1024 * 1024) return setImgError(tr('ไฟล์ใหญ่เกิน 5 MB', 'File is larger than 5 MB'))
    try {
      set({ image: await readImage(file) })
    } catch {
      setImgError(tr('ไม่สามารถอ่านไฟล์รูปนี้ได้', 'Could not read this image'))
    }
  }

  const pair = (k: 'name' | 'unit', max: number, ph: Record<Lang, string>) => (
    <div className="grid gap-2 sm:grid-cols-2">
      {(['th', 'en'] as Lang[]).map((l) => (
        <div key={l} className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-bold text-muted">{l.toUpperCase()}</span>
          <Input value={value[k][l]} maxLength={max} onChange={(e) => setText(k, l, e.target.value)} onFocus={() => setLang(l)} placeholder={ph[l]}
            aria-label={`${k === 'name' ? tr('ชื่อสินค้า', 'Product name') : tr('ขนาด / หน่วย', 'Size / unit')} (${l === 'th' ? 'ไทย' : 'English'})`} className="pl-12" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <p className="text-xs text-muted">{tr('กรอกทั้งภาษาไทยและภาษาอังกฤษ เพื่อแสดงบน e-Catalog ทุกภาษา', 'Fill in both Thai and English to appear in every e-Catalog language')}</p>

        <div>
          <div className="mb-1.5 text-sm font-medium"><NumLabel n={1} required>{tr('รูปภาพสินค้า', 'Product image')}</NumLabel></div>
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface-2 p-3">
            {value.image
              ? <img src={value.image} alt="" className="size-16 rounded-xl border border-line bg-white object-cover" />
              : <span className="flex size-16 items-center justify-center rounded-xl border border-dashed border-line bg-surface text-muted"><ImagePlus size={20} /></span>}
            <div className="min-w-0 flex-1 text-sm text-muted">{value.image ? tr('แนบรูปแล้ว', 'Image attached') : tr('ยังไม่ได้แนบรูป', 'No image yet')}</div>
            <label className="inline-flex h-9 cursor-pointer items-center rounded-xl border border-line bg-surface px-3 text-sm font-semibold hover:bg-surface-2">
              {value.image ? tr('เปลี่ยนรูป', 'Change') : tr('เลือกรูป', 'Choose image')}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { void upload(e.target.files?.[0]); e.target.value = '' }} />
            </label>
          </div>
          <span className={`mt-1.5 block text-xs ${imgError ? 'text-danger' : 'text-muted'}`}>{imgError || tr('JPG, PNG หรือ WebP · ไม่เกิน 5 MB · แนะนำภาพสี่เหลี่ยมจัตุรัส', 'JPG, PNG or WebP · up to 5 MB · square images work best')}</span>
        </div>

        <div>
          <div className="mb-1.5 text-sm font-medium"><NumLabel n={2} required>{tr('ชื่อสินค้า', 'Product name')}</NumLabel></div>
          {pair('name', 120, { th: 'เช่น มะพร้าวอบกรอบ', en: 'e.g. Coconut Chips' })}
        </div>
        <div>
          <div className="mb-1.5 text-sm font-medium"><NumLabel n={3} required hint={tr('ขนาดหรือหน่วยขาย', 'Size or selling unit')}>{tr('ขนาด / หน่วย', 'Size / unit')}</NumLabel></div>
          {pair('unit', 60, { th: 'เช่น ถุง 100 g', en: 'e.g. 100 g bag' })}
        </div>
        <Field label={<NumLabel n={4} required>{tr('ราคา (บาท)', 'Price (THB)')}</NumLabel>}>
          <Input value={value.price ? String(value.price) : ''} inputMode="numeric" className="sm:max-w-[calc(50%-0.25rem)]" onChange={(e) => set({ price: Number(e.target.value.replace(/\D/g, '').slice(0, 7)) || 0 })} placeholder="0" />
        </Field>
      </div>

      <div className="space-y-3 lg:sticky lg:top-4 lg:self-start">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">{tr('ตัวอย่างบน e-Catalog', 'e-Catalog preview')}</span>
          <div className="inline-flex gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5" role="group" aria-label={tr('ภาษาของตัวอย่าง', 'Preview language')}>
            {(['th', 'en'] as Lang[]).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold ${lang === l ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-fg'}`}>
                <span className={`size-1.5 rounded-full ${langDone(value, l) ? 'bg-success' : 'bg-warning'}`} />
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <Card className="flex flex-col overflow-hidden">
          <div className="relative aspect-square overflow-hidden bg-surface-2">
            {value.image ? <img src={value.image} alt="" className="h-full w-full object-cover" /> : <ProductArt category={shop.category} color={shop.color} className="h-full w-full" />}
            <span className="absolute top-3 left-3"><Num n={1} /></span>
          </div>
          <div className="space-y-1 p-4">
            <div className="flex items-start gap-2"><Num n={2} /><div className="font-semibold">{value.name[lang] || <span className="text-muted">{lang === 'th' ? 'ชื่อสินค้า' : 'Product name'}</span>}</div></div>
            <div className="flex items-center gap-2"><Num n={3} /><div className="text-xs text-muted">{value.unit[lang] || (lang === 'th' ? 'ขนาด / หน่วย' : 'Size / unit')}</div></div>
            <div className="flex items-center gap-2"><Num n={4} /><div className="text-xl font-extrabold text-brand">{fmtMoney(value.price)}</div></div>
          </div>
        </Card>
        <div className="flex items-start justify-between gap-3 text-xs text-muted">
          <p className="leading-relaxed">{tr('ตัวเลขบนการ์ดตรงกับช่องกรอกด้านซ้าย · จุดสีเขียวคือภาษาที่กรอกครบแล้ว', 'Card numbers match the fields on the left · a green dot means that language is complete')}</p>
          <a href={`#/exhibitors/${shop.id}#products`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand hover:underline">
            <ExternalLink size={14} /> {tr('เปิดหน้าร้าน', 'Open shop page')}
          </a>
        </div>
      </div>
    </div>
  )
}
