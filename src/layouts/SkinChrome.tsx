import { Link, NavLink } from 'react-router-dom'
import { CalendarDays, MapPin, Menu, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { Logo } from '../components/Brand'
import { EVENT } from '../data/event'
import { LangToggle } from './LangToggle'
import { ThemeSwitcher } from './ThemeSwitcher'
import { VersionSwitcher } from './VersionSwitcher'

/**
 * Header / Footer เฉพาะธีม (หน้าตาคนละโครงกับธีมคลาสสิก)
 * - Gold: แถบข้อมูลด้านบน + เมนูตัวอักษรเส้นใต้ทอง สไตล์นิตยสาร
 * - Midnight: แถบเมนูลอยทรงแคปซูลแบบกระจก
 */
type Nav = { to: string; th: string; en: string; end?: boolean }
type HeaderProps = { nav: Nav[]; open: boolean; setOpen: (fn: (o: boolean) => boolean) => void }

/* ======================= ธีมทองคำ ======================= */
export function GoldHeader({ nav, open, setOpen }: HeaderProps) {
  const { tr, L } = useI18n()
  return (
    <header className="sticky top-0 z-30">
      {/* แถบข้อมูลด้านบน */}
      <div className="hidden bg-navy text-white/80 md:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-5 px-6 text-xs">
          <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-gold-light" /> {L(EVENT.dateLabel)} · {EVENT.hours}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gold-light" /> {L(EVENT.venue)}</span>
          <div className="ml-auto flex items-center gap-2">
            <VersionSwitcher light />
            <ThemeSwitcher light />
            <LangToggle light />
          </div>
        </div>
      </div>
      <div className="border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" aria-label="MOC Expo 2026 home"><Logo className="h-14" /></Link>
          <nav className="hidden flex-1 items-center justify-center gap-7 xl:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `relative py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-[var(--gold)] after:transition-transform ${isActive ? 'text-fg after:scale-x-100' : 'text-muted after:scale-x-0 hover:text-fg hover:after:scale-x-100'}`}>
                {tr(n.th, n.en)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <span className="md:hidden"><ThemeSwitcher /></span>
            <Link to="/register" className="hidden border border-brand px-5 py-2 text-sm font-semibold tracking-wide text-brand transition-colors hover:bg-brand hover:text-white sm:inline-block dark:hover:text-[#0a1120]">
              {tr('ลงทะเบียน', 'Register')}
            </Link>
            <button className="p-2 hover:bg-surface-2 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line bg-surface px-4 py-4 xl:hidden">
            <div className="grid divide-y divide-line">
              {nav.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end}
                  className={({ isActive }) => `py-3 font-display text-lg ${isActive ? 'text-brand' : 'text-fg'}`}>
                  {tr(n.th, n.en)}
                </NavLink>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><LangToggle /><VersionSwitcher /></div>
              <Link to="/register" className="bg-brand px-5 py-2 text-sm font-semibold text-white dark:text-[#0a1120]">{tr('ลงทะเบียน', 'Register')}</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export function GoldFooter({ nav }: { nav: Nav[] }) {
  const { tr, L } = useI18n()
  return (
    <footer className="mt-16 bg-navy text-white/75">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
        <Logo tone="light" className="mx-auto h-28" />
        <div className="mx-auto mt-8 flex max-w-md items-center gap-4 text-gold-light">
          <span className="h-px flex-1 bg-current opacity-50" /><span className="text-xs tracking-[0.3em]">MOC EXPO 2026</span><span className="h-px flex-1 bg-current opacity-50" />
        </div>
        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {nav.map((n) => <Link key={n.to} to={n.to} className="hover:text-white">{tr(n.th, n.en)}</Link>)}
        </nav>
        <div className="mt-8 font-display text-lg text-white">{L(EVENT.dateLabel)} · {EVENT.hours}</div>
        <div className="mt-1 text-sm">{L(EVENT.venue)}</div>
        <p className="mt-8 text-xs text-white/50">
          {tr('กระทรวงพาณิชย์ · กรมพัฒนาธุรกิจการค้า · สสว.', 'Ministry of Commerce · DBD · OSMEP')} — {tr('ต้นแบบซอฟต์แวร์สำหรับนำเสนอ ข้อมูลทั้งหมดเป็นข้อมูลสมมติ', 'Software prototype; all data is fictional.')}
        </p>
      </div>
    </footer>
  )
}

/* ======================= ธีมมิดไนท์ ======================= */
export function MidnightHeader({ nav, open, setOpen }: HeaderProps) {
  const { tr } = useI18n()
  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] shadow-[0_10px_40px_-15px_rgba(139,92,246,0.5)] backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 pr-2 pl-4">
          <Link to="/" aria-label="MOC Expo 2026 home"><Logo className="h-10" /></Link>
          <nav className="mx-auto hidden items-center gap-1 rounded-full bg-white/5 p-1 xl:flex">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${isActive ? 'bg-brand text-white shadow-[0_0_18px_rgba(139,92,246,0.6)]' : 'text-muted hover:text-fg'}`}>
                {tr(n.th, n.en)}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 xl:ml-0">
            <span className="hidden sm:block"><VersionSwitcher /></span>
            <ThemeSwitcher />
            <span className="hidden sm:block"><LangToggle /></span>
            <Link to="/register" className="gold-gradient hidden rounded-full px-4 py-2 text-sm font-bold text-on-accent shadow-[0_0_20px_rgba(34,211,238,0.35)] sm:inline-block">
              {tr('ลงทะเบียน', 'Register')}
            </Link>
            <button className="rounded-full p-2 hover:bg-white/10 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="grid grid-cols-2 gap-1.5 border-t border-white/10 p-3 xl:hidden">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `rounded-2xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-brand text-white' : 'bg-white/5 text-fg'}`}>
                {tr(n.th, n.en)}
              </NavLink>
            ))}
            <div className="col-span-2 mt-1 flex items-center justify-between">
              <div className="flex items-center gap-2"><LangToggle /><VersionSwitcher /></div>
              <Link to="/register" className="gold-gradient rounded-full px-4 py-2 text-sm font-bold text-on-accent">{tr('ลงทะเบียน', 'Register')}</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export function MidnightFooter({ nav }: { nav: Nav[] }) {
  const { tr, L } = useI18n()
  return (
    <footer className="mt-10 border-t border-white/10">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="gold-text-gradient font-display text-4xl font-bold leading-none sm:text-5xl">MOC EXPO<br />2026</div>
          <p className="mt-4 max-w-sm text-sm text-muted">{L(EVENT.tagline)}</p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">{tr('สำรวจ', 'Explore')}</div>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => <li key={n.to}><Link to={n.to} className="text-fg/80 hover:text-accent">{tr(n.th, n.en)}</Link></li>)}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">{tr('วันและสถานที่', 'When & where')}</div>
          <div className="mt-3 text-sm text-fg">{L(EVENT.dateLabel)}</div>
          <div className="text-sm text-muted">{EVENT.hours}</div>
          <div className="mt-2 text-sm text-muted">{L(EVENT.venue)}</div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-muted">
        {tr('ต้นแบบซอฟต์แวร์สำหรับนำเสนอ — ข้อมูลทั้งหมดเป็นข้อมูลสมมติ', 'Software prototype for presentation — all data shown is fictional.')}
      </div>
    </footer>
  )
}
