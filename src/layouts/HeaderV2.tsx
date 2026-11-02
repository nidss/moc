import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { Logo } from '../components/Brand'
import { LinkButton } from '../components/ui/Button'
import { LangToggle } from './LangToggle'
import { ThemeSwitcher } from './ThemeSwitcher'
import { VersionSwitcher } from './VersionSwitcher'
import { GROUPS_V2, PRIMARY_V2, type NavGroupV2 } from './navV2'

const linkCls = (active: boolean) => `whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${active ? 'text-brand' : 'text-muted hover:text-fg'}`

/** เมนูย่อยแบบ dropdown: เปิดเมื่อชี้เมาส์หรือกด ปิดเมื่อคลิกข้างนอก/กด Esc */
function NavDropdown({ group }: { group: NavGroupV2 }) {
  const { tr } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  // เมาส์ชี้อยู่แล้ว (เมนูเปิดจาก hover) การคลิกไม่ควรปิดเมนู
  const hovering = useRef(false)
  const active = group.items.some((i) => pathname === i.to || pathname.startsWith(i.to + '/'))

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => { hovering.current = true; setOpen(true) }} onMouseLeave={() => { hovering.current = false; setOpen(false) }}>
      <button onClick={() => setOpen((o) => (hovering.current ? true : !o))} aria-haspopup="menu" aria-expanded={open}
        className={`flex items-center gap-1 ${linkCls(active)}`}>
        {tr(group.th, group.en)}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 z-50 -translate-x-1/2 pt-2">
          <div role="menu" className="w-80 rounded-2xl border border-line bg-surface p-2 text-fg shadow-xl">
            {group.items.map((it) => (
              <Link key={it.to} to={it.to} role="menuitem"
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2">
                {it.icon && <span className="mt-0.5 rounded-lg bg-brand-soft p-2 text-brand"><it.icon size={16} /></span>}
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{tr(it.th, it.en)}</span>
                  {it.dth && <span className="block text-xs text-muted">{tr(it.dth, it.den ?? it.dth)}</span>}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Header ของ V2: ลิงก์หลัก 4 อัน + เมนูย่อย 3 กลุ่ม (ใช้สีจาก token จึงเข้ากับทุกธีม) */
export function HeaderV2() {
  const { tr } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/" aria-label="MOC Expo 2026 home"><Logo className="h-11" /></Link>
        <nav className="ml-2 hidden items-center xl:flex">
          {PRIMARY_V2.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => linkCls(isActive)}>{tr(n.th, n.en)}</NavLink>
          ))}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          {GROUPS_V2.map((g) => <NavDropdown key={g.id} group={g} />)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:block"><VersionSwitcher /></span>
          <ThemeSwitcher labelClass="hidden 2xl:inline" />
          <span className="hidden sm:block"><LangToggle /></span>
          <LinkButton to="/register" variant="accent" size="sm" className="hidden sm:inline-flex">{tr('ลงทะเบียนฟรี', 'Register free')}</LinkButton>
          <button className="rounded-lg p-2 hover:bg-surface-2 xl:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface px-4 py-3 xl:hidden">
          <div className="grid grid-cols-2 gap-1">
            {PRIMARY_V2.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}
                className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-brand-soft text-brand' : 'text-fg hover:bg-surface-2'}`}>
                {tr(n.th, n.en)}
              </NavLink>
            ))}
          </div>
          {GROUPS_V2.map((g) => (
            <details key={g.id} className="group mt-1 border-t border-line pt-1">
              <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-fg hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                {tr(g.th, g.en)} <ChevronDown size={16} className="text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="grid gap-0.5 pb-1 pl-2">
                {g.items.map((it) => (
                  <Link key={it.to} to={it.to} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-fg hover:bg-surface-2">
                    {it.icon && <it.icon size={16} className="text-brand" />} {tr(it.th, it.en)}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
            <div className="flex items-center gap-2"><LangToggle /><VersionSwitcher /></div>
            <LinkButton to="/register" variant="accent" size="sm">{tr('ลงทะเบียนฟรี', 'Register free')}</LinkButton>
          </div>
        </nav>
      )}
    </header>
  )
}
