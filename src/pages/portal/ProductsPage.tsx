import { useState } from 'react'
import { Check, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useDemoStore } from '../../store/demoStore'
import { usePortalMe } from '../../store/selectors'
import { isProductComplete } from '../../lib/catalog'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Form'
import { Modal } from '../../components/ui/Modal'
import { ProductArt } from '../../components/Brand'
import { ProductEditor, newProduct } from '../../components/ProductEditor'
import type { Product } from '../../data/types'

export default function ProductsPage() {
  const { tr, L, fmtMoney } = useI18n()
  const me = usePortalMe()
  const saveProduct = useDemoStore((s) => s.saveProduct)
  const removeProduct = useDemoStore((s) => s.removeProduct)
  const [q, setQ] = useState('')
  const [draft, setDraft] = useState<Product | null>(null)
  const [error, setError] = useState('')

  const needle = q.trim().toLowerCase()
  const list = me.products.filter((p) => !needle || [p.name.th, p.name.en].some((s) => s.toLowerCase().includes(needle)))
  const editingIndex = draft ? me.products.findIndex((p) => p.id === draft.id) : -1

  const open = (p: Product) => { setDraft(p); setError('') }
  const save = () => {
    if (!draft) return
    if (!draft.name.th.trim() && !draft.name.en.trim()) return setError(tr('กรุณากรอกชื่อสินค้าอย่างน้อย 1 ภาษา', 'Please enter a product name in at least one language'))
    saveProduct(me.id, draft)
    setDraft(null)
  }
  const remove = (p: Product) => {
    if (window.confirm(tr(`ลบ “${L(p.name) || p.name.th}” ออกจาก e-Catalog?`, `Remove “${L(p.name) || p.name.en}” from the e-Catalog?`))) {
      removeProduct(me.id, p.id)
      setDraft(null)
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{tr('สินค้าบน e-Catalog', 'e-Catalog products')}</h2>
          <p className="text-sm text-muted">{tr('เพิ่ม แก้ไข หรือซ่อนสินค้าได้ตลอดก่อนวันงาน · แสดงบนหน้าร้านทันทีที่บันทึกและข้อมูลครบ', 'Add, edit or hide products any time before the event · shown on your shop page as soon as it is complete')}</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ค้นหาสินค้า', 'Search products')} className="pl-10" aria-label={tr('ค้นหาสินค้า', 'Search products')} />
          </div>
          <Button variant="accent" icon={<Plus size={16} />} onClick={() => open(newProduct(me.id))}>{tr('เพิ่มสินค้า', 'Add product')}</Button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => {
          const complete = isProductComplete(p)
          return (
            <Card key={p.id} className="flex flex-col overflow-hidden">
              <div className={`relative aspect-[4/3] overflow-hidden bg-surface-2 ${p.hidden ? 'opacity-55' : ''}`}>
                {p.image ? <img src={p.image} alt={L(p.name)} loading="lazy" className="h-full w-full object-cover" /> : <ProductArt category={me.category} color={me.color} className="h-full w-full" />}
                <span className="absolute top-3 left-3">
                  {p.hidden ? <Badge tone="neutral" dot>{tr('ซ่อนอยู่', 'Hidden')}</Badge> : complete ? <Badge tone="success" dot>{tr('แสดงอยู่', 'Live')}</Badge> : <Badge tone="warning" dot>{tr('ข้อมูลยังไม่ครบ', 'Incomplete')}</Badge>}
                </span>
              </div>
              <div className="flex-1 space-y-0.5 p-4">
                <h3 className="font-bold">{p.name.th || p.name.en || tr('(ไม่มีชื่อ)', '(untitled)')}</h3>
                <p className="text-sm text-muted">{p.name.en || tr('ยังไม่ได้กรอกภาษาอังกฤษ', 'English not filled in')}</p>
                <p className="pt-1 text-sm"><b className="text-brand">{fmtMoney(p.price)}</b> <span className="text-muted">· {L(p.unit) || '—'}</span></p>
              </div>
              <div className="flex border-t border-line p-1.5">
                <button onClick={() => open(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-brand hover:bg-surface-2"><Pencil size={15} /> {tr('แก้ไข', 'Edit')}</button>
                <button onClick={() => saveProduct(me.id, { ...p, hidden: !p.hidden })} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-muted hover:bg-surface-2">
                  {p.hidden ? <Eye size={15} /> : <EyeOff size={15} />} {p.hidden ? tr('แสดง', 'Show') : tr('ซ่อน', 'Hide')}
                </button>
                <button onClick={() => remove(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-danger hover:bg-surface-2"><Trash2 size={15} /> {tr('ลบ', 'Delete')}</button>
              </div>
            </Card>
          )
        })}
        <button onClick={() => open(newProduct(me.id))} className="flex min-h-64 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line text-sm font-semibold text-brand hover:border-brand/50">
          <Plus size={20} /> {tr('เพิ่มสินค้า', 'Add product')}
          <span className="text-xs font-normal text-muted">{tr('แสดงบน e-Catalog ทันทีเมื่อกรอกครบ', 'Goes live once complete')}</span>
        </button>
      </div>

      <Modal wide open={!!draft} onClose={() => setDraft(null)}
        title={<span>{editingIndex >= 0 ? tr('แก้ไขสินค้า', 'Edit product') : tr('เพิ่มสินค้า', 'Add product')}<span className="ml-2 text-sm font-normal text-muted">{editingIndex >= 0 ? tr(`สินค้า ${editingIndex + 1} จาก ${me.products.length}`, `Product ${editingIndex + 1} of ${me.products.length}`) : ''}</span></span>}
        footer={draft && <>
          {error && <span role="alert" className="mr-auto text-sm text-danger">{error}</span>}
          {editingIndex >= 0 && !error && <button onClick={() => remove(draft)} className="mr-auto inline-flex items-center gap-1.5 text-sm font-semibold text-danger"><Trash2 size={16} /> {tr('ลบสินค้า', 'Delete product')}</button>}
          <Button variant="secondary" onClick={() => setDraft(null)}>{tr('ยกเลิก', 'Cancel')}</Button>
          <Button variant="accent" icon={<Check size={16} />} onClick={save}>{tr('บันทึกสินค้า', 'Save product')}</Button>
        </>}>
        {draft && <ProductEditor value={draft} onChange={(p) => { setDraft(p); setError('') }} shop={me} />}
      </Modal>
    </div>
  )
}
