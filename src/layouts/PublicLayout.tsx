import { useEffect, useState, Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { Logo } from '../components/Brand'
import { LinkButton } from '../components/ui/Button'
import { LangToggle } from './LangToggle'
import { EVENT } from '../data/event'

export const PUBLIC_NAV = [
  { to: '/', th: 'หน้าแรก', en: 'Home', end: true },
  { to: '/event', th: 'เกี่ยวกับงาน', en: 'About' },
  { to: '/schedule', th: 'กำหนดการ', en: 'Schedule' },
  { to: '/exhibitors', th: 'ผู้ออกบูธ', en: 'Exhibitors' },
  { to: '/floorplan', th: 'ผังงาน', en: 'Floor Plan' },
  { to: '/matching', th: 'Business Matching', en: 'Business Matching' },
  { to: '/ai', th: 'Ask MOC AI', en: 'Ask MOC AI' },
]

export function PublicLayout() {
  const { tr, L } = useI18n()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="MOC Expo 2026 home"><Logo className="h-10 sm:h-11" /></Link>
          <nav className="ml-4 hidden items-center gap-1 xl:flex">
            {PUBLIC_NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-soft text-brand' : 'text-muted hover:text-fg'}`}>
                {tr(n.th, n.en)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:block"><LangToggle /></span>
            <LinkButton to="/register" variant="accent" size="sm" className="hidden sm:inline-flex">{tr('ลงทะเบียน', 'Register')}</LinkButton>
            <button className="rounded-lg p-2 hover:bg-surface-2 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line bg-surface px-4 py-3 xl:hidden">
            <div className="grid gap-1">
              {PUBLIC_NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end}
                  className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand-soft text-brand' : 'text-fg hover:bg-surface-2'}`}>
                  {tr(n.th, n.en)}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <LangToggle />
              <LinkButton to="/register" variant="accent" size="sm">{tr('ลงทะเบียน', 'Register')}</LinkButton>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="mt-16 bg-navy text-white/80">
        <div className="gold-gradient h-1" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <Logo tone="light" className="h-16" />
            <p className="mt-3 text-sm text-white/70">{L(EVENT.tagline)}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/55">
              {tr('กระทรวงพาณิชย์ · กรมพัฒนาธุรกิจการค้า · สำนักงานส่งเสริมวิสาหกิจขนาดกลางและขนาดย่อม (สสว.)', 'Ministry of Commerce · Department of Business Development · OSMEP')}
            </p>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-white">{L(EVENT.dateLabel)}</div>
            <div className="mt-1">{EVENT.hours}</div>
            <div className="mt-1">{L(EVENT.venue)}</div>
          </div>
          <div className="text-sm text-white/60">
            {tr('ต้นแบบซอฟต์แวร์สำหรับนำเสนอ — ข้อมูลทั้งหมดเป็นข้อมูลสมมติ', 'Software prototype for presentation — all data shown is fictional.')}
          </div>
        </div>
      </footer>
    </div>
  )
}
