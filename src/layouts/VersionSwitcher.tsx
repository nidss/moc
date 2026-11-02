import { Layers } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { setVersion, useVersion, type SiteVersion } from '../lib/version'

/** ปุ่มสลับเวอร์ชันหน้าเว็บ V1 / V2 (วางคู่กับปุ่มธีม) — light ใช้บนพื้นเข้ม */
export function VersionSwitcher({ light = false }: { light?: boolean }) {
  const { tr } = useI18n()
  const version = useVersion()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  // อยู่ที่ /v1 หรือ /v2 ให้เปลี่ยน URL ตามด้วย
  const pick = (v: SiteVersion) => {
    setVersion(v)
    if (pathname === '/v1' || pathname === '/v2') navigate(`/${v}`, { replace: true })
  }
  const items: { id: SiteVersion; hint: string }[] = [
    { id: 'v1', hint: tr('หน้าแรกแบบเต็ม', 'Full home page') },
    { id: 'v2', hint: tr('หน้าแรกแบบกระชับ', 'Compact home page') },
  ]
  return (
    <div role="group" aria-label={tr('เวอร์ชันหน้าเว็บ', 'Site version')}
      className={`inline-flex h-8 items-center rounded-full border p-0.5 text-xs font-semibold ${light ? 'border-white/25 bg-white/10' : 'border-line bg-surface'}`}>
      <Layers size={14} className={`mx-1.5 ${light ? 'text-white/70' : 'text-muted'}`} aria-hidden />
      {items.map((it) => (
        <button key={it.id} onClick={() => pick(it.id)} aria-pressed={version === it.id} title={it.hint}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${version === it.id ? (light ? 'bg-white text-navy' : 'bg-brand text-white dark:text-[#0a1120]') : light ? 'text-white/80 hover:text-white' : 'text-muted hover:text-fg'}`}>
          {it.id}
        </button>
      ))}
    </div>
  )
}
