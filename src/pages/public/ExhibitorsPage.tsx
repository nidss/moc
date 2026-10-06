import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { CATEGORIES, PAVILIONS, PRODUCT_TYPES, PROVINCES } from '../../data/event'
import { useExhibitors } from '../../store/selectors'
import { PageHeader, EmptyState } from '../../components/ui/Card'
import { Input, Select } from '../../components/ui/Form'
import { ExhibitorCard } from '../../components/ExhibitorCard'

const KEYS = ['category', 'pavilion', 'province', 'type'] as const

export default function ExhibitorsPage() {
  const { tr, L } = useI18n()
  const [params, setParams] = useSearchParams()
  const exhibitors = useExhibitors()
  const q = params.get('q') ?? ''

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return exhibitors
      .filter((e) => e.status === 'approved')
      .filter((e) => !params.get('category') || e.category === params.get('category'))
      .filter((e) => !params.get('pavilion') || e.pavilion === params.get('pavilion'))
      .filter((e) => !params.get('province') || e.province === params.get('province'))
      .filter((e) => !params.get('type') || e.productType === params.get('type'))
      .filter((e) =>
        !needle ||
        [e.name.th, e.name.en, e.description.th, e.description.en, ...e.products.flatMap((p) => [p.name.th, p.name.en]), ...e.tags]
          .some((s) => s.toLowerCase().includes(needle)),
      )
  }, [exhibitors, params, q])

  const activeCount = KEYS.filter((k) => params.get(k)).length

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('ผู้ออกบูธ', 'Exhibitors')} title={tr('ค้นหาผู้ประกอบการ SME', 'Find SME Exhibitors')}
        subtitle={tr('ค้นหาตามชื่อร้าน สินค้า หมวดหมู่ หรือจังหวัด แล้วดู e-Catalog ได้ทันที', 'Search by shop, product, category or province and open their e-Catalog.')} />

      <div className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => set('q', e.target.value)} placeholder={tr('ค้นหา เช่น มะพร้าว, กาแฟ, ผ้าคราม...', 'Search e.g. coconut, coffee, indigo...')} className="pl-10" aria-label="Search" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Select value={params.get('category') ?? ''} onChange={(e) => set('category', e.target.value)} aria-label="Category">
            <option value="">{tr('ทุกหมวดหมู่', 'All categories')}</option>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
          </Select>
          <Select value={params.get('pavilion') ?? ''} onChange={(e) => set('pavilion', e.target.value)} aria-label="Pavilion">
            <option value="">{tr('ทุก Pavilion', 'All pavilions')}</option>
            {Object.entries(PAVILIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </Select>
          <Select value={params.get('province') ?? ''} onChange={(e) => set('province', e.target.value)} aria-label="Province">
            <option value="">{tr('ทุกจังหวัด', 'All provinces')}</option>
            {Object.entries(PROVINCES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
          </Select>
          <Select value={params.get('type') ?? ''} onChange={(e) => set('type', e.target.value)} aria-label="Product type">
            <option value="">{tr('ทุกประเภทสินค้า', 'All product types')}</option>
            {Object.entries(PRODUCT_TYPES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
          </Select>
        </div>
      </div>

      <div className="mt-5 mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <SlidersHorizontal size={16} />
          {tr(`พบ ${list.length} ราย`, `${list.length} exhibitors found`)}
        </div>
        {(activeCount > 0 || q) && (
          <button onClick={() => setParams({}, { replace: true })} className="flex items-center gap-1 font-semibold text-brand hover:underline">
            <X size={14} /> {tr('ล้างตัวกรอง', 'Clear filters')}
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<Search size={28} />} title={tr('ไม่พบผู้ออกบูธที่ตรงเงื่อนไข', 'No exhibitors match your filters')} hint={tr('ลองเปลี่ยนคำค้นหรือล้างตัวกรอง', 'Try another keyword or clear filters')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((e) => <ExhibitorCard key={e.id} ex={e} />)}
        </div>
      )}
    </div>
  )
}
