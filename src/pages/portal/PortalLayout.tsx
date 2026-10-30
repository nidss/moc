import { Suspense } from 'react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, Handshake, Home, LogOut, Package, ScanLine, ShieldCheck, Store } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { CATEGORIES, PAVILIONS, PROVINCES } from '../../data/event'
import { useDemoStore } from '../../store/demoStore'
import { useExhibitor } from '../../store/selectors'
import { OrgAvatar } from '../../components/Brand'
import { Badge } from '../../components/ui/Badge'
import { Button, LinkButton } from '../../components/ui/Button'

/** SME Portal: พื้นที่ร้านค้าที่รวม e-Catalog, Business Matching และผู้เยี่ยมชมบูธ ไว้หลัง login เดียว */
export default function PortalLayout() {
  const { tr, L } = useI18n()
  const navigate = useNavigate()
  const portalId = useDemoStore((s) => s.portalId)
  const logout = useDemoStore((s) => s.portalLogout)
  const me = useExhibitor(portalId)
  const upcoming = useDemoStore((s) => s.myMeetings.filter((m) => m.exhibitorId === portalId && (m.status === 'pending' || m.status === 'confirmed')).length)

  if (!me) return <Navigate to="/portal/login" replace />

  const tabs = [
    { to: '/portal', end: true, icon: Home, label: tr('ภาพรวม', 'Overview') },
    { to: '/portal/products', icon: Package, label: tr('สินค้า (e-Catalog)', 'Products (e-Catalog)'), count: me.products.length },
    { to: '/portal/shop', icon: Store, label: tr('ข้อมูลร้านค้า', 'Shop info') },
    { to: '/portal/matching', icon: Handshake, label: 'Business Matching', count: me.matching ? upcoming : 0 },
    { to: '/portal/booth', icon: ScanLine, label: tr('ผู้เยี่ยมชมบูธ', 'Booth visitors') },
  ]

  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <OrgAvatar org={me} />
              <div className="min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand">{tr('ร้านค้าของฉัน', 'My Shop')} · SME Portal</div>
                <h1 className="mt-0.5 text-xl font-bold sm:text-2xl">{L(me.name)}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                  {me.smeOneId && <span className="inline-flex items-center gap-1 text-success"><ShieldCheck size={13} /> SME ONE ID {me.smeOneId}</span>}
                  <span>{tr('บูธ', 'Booth')} {me.booth} · {PAVILIONS[me.pavilion].name}</span>
                  <span>{L(CATEGORIES[me.category])} · {L(PROVINCES[me.province] ?? { th: me.province, en: me.province })}</span>
                  {me.status === 'pending' && <Badge tone="warning" dot>{tr('รอผู้จัดงานอนุมัติ', 'Pending approval')}</Badge>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <LinkButton to={`/exhibitors/${me.id}`} variant="secondary" size="sm" icon={<ExternalLink size={16} />}>{tr('ดูหน้าร้านบน e-Catalog', 'View e-Catalog page')}</LinkButton>
              <Button variant="ghost" size="sm" icon={<LogOut size={16} />} onClick={() => { logout(); navigate('/portal/login') }}>{tr('ออกจากระบบ', 'Log out')}</Button>
            </div>
          </div>
          <nav className="no-scrollbar mt-5 flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <NavLink key={t.to} to={t.to} end={t.end}
                className={({ isActive }) => `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold ${isActive ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-fg'}`}>
                <t.icon size={16} /> {t.label}
                {!!t.count && <span className="rounded-full bg-accent px-1.5 text-[11px] text-on-accent">{t.count}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Suspense fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
