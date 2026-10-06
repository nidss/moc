import { useEffect, useState, Suspense } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, Briefcase, ExternalLink, FileSpreadsheet, Menu, Store, Users, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { Logo } from '../components/Brand'
import { LangToggle } from './LangToggle'

const NAV = [
  { to: '/admin', icon: BarChart3, th: 'ภาพรวม', en: 'Dashboard', end: true },
  { to: '/admin/attendees', icon: Users, th: 'ผู้เข้าร่วมงาน', en: 'Attendees' },
  { to: '/admin/exhibitors', icon: Store, th: 'ผู้ออกบูธ', en: 'Exhibitors' },
  { to: '/admin/matching', icon: Briefcase, th: 'Business Matching', en: 'Business Matching' },
  { to: '/admin/reports', icon: FileSpreadsheet, th: 'รายงาน & Export', en: 'Reports & Export' },
]

export function AdminLayout() {
  const { tr } = useI18n()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  const nav = (
    <nav className="grid gap-1">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end}
          className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/6 hover:text-white'}`}>
          <n.icon size={18} /> {tr(n.th, n.en)}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#061a3d] p-4 lg:flex">
        <Link to="/admin" className="mb-6 px-2"><Logo light /></Link>
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">Organizer Console</div>
        {nav}
        <Link to="/" className="mt-auto flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white">
          <ExternalLink size={16} /> {tr('ดูเว็บไซต์งาน', 'View event site')}
        </Link>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-[#061a3d] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo light />
              <button className="text-white/70" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
        <button className="rounded-lg p-2 hover:bg-surface-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu size={22} /></button>
        <div className="truncate text-sm font-semibold text-muted"><span className="hidden sm:inline">MOC Expo 2026 · </span><span className="text-fg">{tr('ระบบบริหารจัดการงาน', 'Event Management')}</span></div>
        <div className="ml-auto flex items-center gap-3">
          <LangToggle />
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white dark:text-[#0a1120]">AD</span>
            <div className="text-xs leading-tight">
              <div className="font-semibold">Admin</div>
              <div className="text-muted">{tr('ผู้จัดงาน', 'Organizer')}</div>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
