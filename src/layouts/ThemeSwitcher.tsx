import { useEffect, useRef, useState } from 'react'
import { Check, Palette } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { SKINS, setSkin, useSkin } from '../lib/skin'

/** ปุ่มสลับธีม (คลาสสิก / หยกมรกต / มิดไนท์) — light ใช้บน header พื้นเข้ม */
export function ThemeSwitcher({ light = false, align = 'right', labelClass = 'hidden md:inline' }: { light?: boolean; align?: 'left' | 'right'; labelClass?: string }) {
  const { tr, L } = useI18n()
  const skin = useSkin()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = SKINS.find((s) => s.id === skin)!

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}
        aria-label={tr('เปลี่ยนธีม', 'Change theme')} title={tr('เปลี่ยนธีม', 'Change theme')}
        className={`flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition-colors ${light ? 'border-white/25 bg-white/10 text-white hover:bg-white/20' : 'border-line bg-surface text-fg hover:bg-surface-2'}`}>
        <Palette size={14} className={light ? 'text-white/80' : 'text-muted'} />
        <span className="flex -space-x-1">
          {active.swatch.slice(0, 2).map((c) => <span key={c} className="size-3 rounded-full ring-2 ring-white/80" style={{ background: c }} />)}
        </span>
        <span className={`whitespace-nowrap ${labelClass}`}>{L(active.name)}</span>
      </button>
      {open && (
        <div role="menu" className={`absolute top-10 z-50 w-64 rounded-2xl border border-line bg-surface p-2 text-fg shadow-xl ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="px-2 pt-1 pb-2 text-xs font-semibold text-muted">{tr('ธีมหน้าตาเว็บไซต์', 'Site theme')}</div>
          {SKINS.map((s) => (
            <button key={s.id} role="menuitemradio" aria-checked={skin === s.id}
              onClick={() => { setSkin(s.id); setOpen(false) }}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${skin === s.id ? 'bg-brand-soft' : 'hover:bg-surface-2'}`}>
              <span className="grid size-10 shrink-0 grid-cols-2 overflow-hidden rounded-lg ring-1 ring-black/10" aria-hidden>
                <span className="col-span-2" style={{ background: s.swatch[0] }} />
                <span style={{ background: s.swatch[1] }} />
                <span style={{ background: s.swatch[2] }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{L(s.name)}</span>
                <span className="block text-xs text-muted">{L(s.desc)}</span>
              </span>
              {skin === s.id && <Check size={16} className="shrink-0 text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
