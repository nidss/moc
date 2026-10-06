import { Suspense } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, ScanLine, Wifi } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { Logo } from '../components/Brand'
import { LangToggle } from './LangToggle'

/** หน้าจอแอปเช็คอินสำหรับเจ้าหน้าที่ (ออกแบบสำหรับมือถือ / แท็บเล็ต) */
export function StaffLayout() {
  const { tr } = useI18n()
  const tabs = [
    { to: '/staff/scan', icon: ScanLine, th: 'สแกน', en: 'Scan' },
    { to: '/staff/dashboard', icon: LayoutDashboard, th: 'สรุปเช็คอิน', en: 'Dashboard' },
  ]
  return (
    <div className="min-h-screen bg-bg pb-24">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/staff/scan" className="flex items-center gap-2">
            <Logo tone="light" className="h-8" />
            <div className="leading-tight">
              <div className="text-sm font-bold">MOC Check-in</div>
              <div className="text-[11px] text-white/70">{tr('เจ้าหน้าที่: ประตู A · เครื่อง 03', 'Staff: Gate A · Device 03')}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-[11px] font-semibold text-emerald-300 sm:flex">
              <Wifi size={12} /> Online
            </span>
            <LangToggle light />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5">
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to}
              className={({ isActive }) => `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold ${isActive ? 'text-brand' : 'text-muted'}`}>
              <t.icon size={22} />
              {tr(t.th, t.en)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
