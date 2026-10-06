import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { CalendarClock, Search, ShieldCheck } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EXHIBITOR_BY_ID, DEMO_SME_ID } from '../../data/exhibitors'
import { useDemoStore } from '../../store/demoStore'
import { OrgAvatar } from '../../components/Brand'

export default function MatchingLayout() {
  const { tr, L } = useI18n()
  const me = EXHIBITOR_BY_ID[DEMO_SME_ID]
  const upcoming = useDemoStore((s) => s.myMeetings.filter((m) => m.status !== 'completed').length)

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">Business Matching · SME Portal</div>
              <h1 className="mt-1 text-2xl font-bold">{tr('จับคู่ธุรกิจกับ Buyer', 'Match with Buyers')}</h1>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface-2 py-2 pr-4 pl-2">
              <OrgAvatar org={me} size="sm" />
              <div className="text-sm leading-tight">
                <div className="font-semibold">{L(me.name)}</div>
                <div className="flex items-center gap-1 text-xs text-success"><ShieldCheck size={12} /> SME ONE ID {me.smeOneId}</div>
              </div>
            </div>
          </div>
          <nav className="mt-5 flex gap-1">
            {[
              { to: '/matching', end: true, icon: Search, label: tr('ค้นหา Buyer', 'Discover Buyers') },
              { to: '/matching/meetings', icon: CalendarClock, label: tr('นัดหมายของฉัน', 'My Meetings'), count: upcoming },
            ].map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) => `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${isActive ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-fg'}`}>
                <t.icon size={16} /> {t.label}
                {!!t.count && <span className="rounded-full bg-accent px-1.5 text-[11px] text-on-accent">{t.count}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
