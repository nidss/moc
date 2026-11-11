import { Layers } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

/** v1 = ผังแนวคิด 2.5D เดิม, v2 = ผังตามแบบจริง (ค่าเริ่มต้น) */
export type MapVersion = 'v1' | 'v2'

/** ลิงก์ไปหน้าผังงานเต็ม พร้อมโซนและเวอร์ชันผัง (v2 ไม่ต้องใส่ param) */
export function floorPlanHref(map: MapVersion, zone?: string) {
  const q = new URLSearchParams({ ...(zone ? { zone } : {}), ...(map === 'v1' ? { map } : {}) }).toString()
  return q ? `/floorplan?${q}` : '/floorplan'
}

/** ปุ่มสลับเวอร์ชันผังงาน V1 / V2 ใช้ทั้งในหน้า /floorplan และหน้าแรก */
export function FloorPlanVersionToggle({ value, onChange }: { value: MapVersion; onChange: (v: MapVersion) => void }) {
  const { tr } = useI18n()
  const items: { id: MapVersion; hint: string }[] = [
    { id: 'v1', hint: tr('ผังแนวคิด 2.5D', '2.5D concept map') },
    { id: 'v2', hint: tr('ผังตามแบบจริง', 'Actual venue layout') },
  ]
  return (
    <div role="group" aria-label={tr('เวอร์ชันผังงาน', 'Floor plan version')} className="inline-flex items-center rounded-full border border-line bg-surface p-1 text-xs font-semibold">
      <Layers size={14} className="mx-2 text-muted" aria-hidden />
      {items.map((v) => (
        <button key={v.id} type="button" onClick={() => onChange(v.id)} aria-pressed={value === v.id} title={v.hint}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${value === v.id ? 'bg-brand text-white dark:text-[#0a1120]' : 'text-muted hover:text-fg'}`}>
          <span className="uppercase">{v.id}</span><span className="hidden font-medium opacity-80 sm:inline">· {v.hint}</span>
        </button>
      ))}
    </div>
  )
}
