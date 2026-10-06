import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Briefcase, ChevronDown, Map, PlayCircle, QrCode, RotateCcw, User, Sparkles } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useDemoStore } from '../store/demoStore'
import { LangToggle } from './LangToggle'

const ROLES = [
  { to: '/', match: ['/', '/event', '/schedule', '/exhibitors', '/floorplan', '/register', '/survey'], icon: User, th: 'ผู้เข้าชม', en: 'Visitor' },
  { to: '/staff/scan', match: ['/staff'], icon: QrCode, th: 'เจ้าหน้าที่', en: 'Staff' },
  { to: '/matching', match: ['/matching'], icon: Briefcase, th: 'SME / Buyer', en: 'SME / Buyer' },
  { to: '/admin', match: ['/admin'], icon: BarChart3, th: 'ผู้จัดงาน', en: 'Organizer' },
]

/** แถบลอยสำหรับผู้นำเสนอ: สลับบทบาท ภาษา และรีเซ็ตข้อมูลเดโม */
export function DemoNav() {
  const { tr } = useI18n()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const reset = useDemoStore((s) => s.reset)
  const [open, setOpen] = useState(false)

  const active = ROLES.find((r) => r.match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m))))

  return (
    <div className={`fixed right-3 z-40 print:hidden sm:right-5 ${pathname.startsWith('/staff') ? 'bottom-20' : 'bottom-3 sm:bottom-5'}`}>
      {open && (
        <div className="mb-2 w-72 rounded-2xl border border-line bg-surface p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">{tr('โหมดนำเสนอ', 'Demo mode')}</span>
            <LangToggle />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {ROLES.map((r) => (
              <Link key={r.to} to={r.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${active === r ? 'bg-brand text-white dark:text-[#0a1120]' : 'bg-surface-2 hover:bg-brand-soft'}`}>
                <r.icon size={16} /> {tr(r.th, r.en)}
              </Link>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-xs">
            <Link to="/demo" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2 hover:bg-brand-soft">
              <PlayCircle size={16} /> {tr('เส้นทางเดโม', 'Demo story')}
            </Link>
            <Link to="/ai" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2 hover:bg-brand-soft">
              <Sparkles size={16} /> Ask AI
            </Link>
            <Link to="/floorplan" onClick={() => setOpen(false)} className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2 hover:bg-brand-soft">
              <Map size={16} /> {tr('ผังงาน', 'Floor plan')}
            </Link>
          </div>
          <button
            onClick={() => {
              if (window.confirm(tr('ล้างข้อมูลที่สร้างระหว่างเดโมทั้งหมด?', 'Clear all data created during this demo?'))) {
                reset()
                setOpen(false)
                navigate('/demo')
              }
            }}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-medium text-muted hover:text-danger">
            <RotateCcw size={14} /> {tr('รีเซ็ตข้อมูลเดโม', 'Reset demo data')}
          </button>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)}
        className="ml-auto flex items-center gap-2 rounded-full bg-navy py-2 pr-3 pl-2 text-sm font-semibold text-white shadow-xl ring-1 ring-white/10 hover:bg-navy-2"
        aria-expanded={open}>
        <span className="flex size-7 items-center justify-center rounded-full bg-accent text-on-accent">
          {active ? <active.icon size={15} /> : <PlayCircle size={15} />}
        </span>
        <span className="hidden sm:inline">{active ? tr(active.th, active.en) : 'Demo'}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
