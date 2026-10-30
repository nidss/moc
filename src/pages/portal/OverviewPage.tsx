import { Link } from 'react-router-dom'
import { CalendarDays, Check, ClipboardList, MapPin } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT, PAVILIONS } from '../../data/event'
import { BUYER_BY_ID, BUYERS, OBJECTIVES } from '../../data/buyers'
import { useDemoStore } from '../../store/demoStore'
import { usePortalMe } from '../../store/selectors'
import { buyerScore, catalogProducts, isProductComplete } from '../../lib/catalog'
import { Card } from '../../components/ui/Card'
import { LinkButton } from '../../components/ui/Button'
import { OrgAvatar } from '../../components/Brand'
import { MeetingStatusBadge } from '../../components/StatusBadges'

function Stat({ label, value, sub, tone = '' }: { label: string; value: string; sub: string; tone?: string }) {
  return (
    <Card className="p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-bold tabular-nums ${tone}`}>{value}</div>
      <div className="mt-1 text-xs text-muted">{sub}</div>
    </Card>
  )
}

export default function OverviewPage() {
  const { tr, L, fmtDate, fmtNumber } = useI18n()
  const me = usePortalMe()
  const meetings = useDemoStore((s) => s.myMeetings).filter((m) => m.exhibitorId === me.id)
  const leads = useDemoStore((s) => s.boothLeads).filter((l) => l.exhibitorId === me.id)

  const shown = catalogProducts(me).length
  const incomplete = me.products.filter((p) => !isProductComplete(p)).length
  const upcoming = meetings.filter((m) => m.status === 'pending' || m.status === 'confirmed').sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  const met = new Set(meetings.map((m) => m.buyerId))
  const recommended = BUYERS.filter((b) => !met.has(b.id)).map((b) => ({ b, score: buyerScore(me, b) })).sort((a, b) => b.score - a.score).slice(0, 2)

  const checklist = [
    { done: true, title: tr('ลงทะเบียนผู้ประกอบการ', 'Exhibitor registration'), desc: me.registeredAt ? tr(`ยืนยันเมื่อ ${fmtDate(me.registeredAt)}`, `Confirmed ${fmtDate(me.registeredAt)}`) : tr('ยืนยันแล้ว', 'Confirmed') },
    { done: me.status === 'approved', title: tr('ผู้จัดงานอนุมัติบูธ', 'Booth approved by organiser'), desc: me.status === 'approved' ? tr(`บูธ ${me.booth}`, `Booth ${me.booth}`) : tr('อยู่ระหว่างตรวจสอบข้อมูล', 'Under review') },
    { done: !!me.logo && !!(me.stores.website || me.social.facebook || me.contact.line), title: tr('ข้อมูลร้านค้าครบถ้วน', 'Shop profile complete'), desc: tr('โลโก้ และช่องทางติดต่ออย่างน้อย 1 ช่องทาง', 'Logo and at least one contact channel'), to: '/portal/shop', cta: tr('กรอกต่อ', 'Complete') },
    { done: me.products.length > 0 && incomplete === 0, title: tr('สินค้าบน e-Catalog ครบทุกรายการ', 'All e-Catalog products complete'), desc: me.products.length ? tr(`แสดงอยู่ ${shown} จาก ${me.products.length} รายการ`, `${shown} of ${me.products.length} shown`) : tr('ยังไม่มีสินค้า', 'No products yet'), to: '/portal/products', cta: me.products.length ? tr('กรอกต่อ', 'Complete') : tr('เพิ่มสินค้า', 'Add') },
    me.matching
      ? { done: meetings.length > 0, title: tr('นัดหมาย Business Matching', 'Business Matching meetings'), desc: tr(`มี ${meetings.length} นัดหมาย`, `${meetings.length} meeting(s)`), to: '/portal/matching', cta: tr('ค้นหา Buyer', 'Find buyers') }
      : { done: false, title: tr('เข้าร่วม Business Matching', 'Join Business Matching'), desc: tr('ไม่บังคับ · เจรจาธุรกิจกับ Buyer ในงาน', 'Optional · meet buyers at the event'), to: '/portal/matching', cta: tr('ดูรายละเอียด', 'Learn more') },
    { done: (me.documents?.length ?? 0) > 0, title: tr('แนบเอกสารประกอบบริษัท', 'Company documents'), desc: tr('ไม่บังคับ · ช่วยให้ผู้จัดงานอนุมัติเร็วขึ้น', 'Optional · speeds up approval'), to: '/portal/shop', cta: tr('แนบไฟล์', 'Attach') },
  ]
  const done = checklist.filter((c) => c.done).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={tr('สินค้าที่แสดงบน e-Catalog', 'Products on e-Catalog')} value={`${shown} / ${me.products.length}`} tone={incomplete ? '' : 'text-success'}
          sub={incomplete ? tr(`${incomplete} รายการข้อมูลยังไม่ครบ`, `${incomplete} incomplete`) : tr('ครบทุกรายการ', 'All complete')} />
        <Stat label={tr('นัดหมาย Business Matching', 'Business Matching meetings')} value={me.matching ? fmtNumber(meetings.length) : '—'}
          sub={me.matching ? tr(`ยืนยันแล้ว ${meetings.filter((m) => m.status === 'confirmed').length} · รอยืนยัน ${meetings.filter((m) => m.status === 'pending').length}`, `${meetings.filter((m) => m.status === 'confirmed').length} confirmed · ${meetings.filter((m) => m.status === 'pending').length} pending`) : tr('ยังไม่ได้เข้าร่วม', 'Not joined')} />
        <Stat label={tr('ผู้เยี่ยมชมบูธ', 'Booth visitors')} value={fmtNumber(leads.length)} sub={tr(`ผู้สนใจ / ติดตามต่อ ${leads.filter((l) => l.interest !== 'visited').length}`, `${leads.filter((l) => l.interest !== 'visited').length} interested / follow up`)} />
        <Stat label={tr('ความพร้อมก่อนวันงาน', 'Event readiness')} value={`${Math.round((done / checklist.length) * 100)}%`} sub={tr(`${done} จาก ${checklist.length} รายการ`, `${done} of ${checklist.length} items`)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 className="text-lg font-bold">{tr('นัดหมายที่ใกล้ถึง', 'Upcoming meetings')}</h2><p className="text-sm text-muted">Business Matching Lounge</p></div>
              {me.matching && <Link to="/portal/matching/meetings" className="text-sm font-semibold text-brand hover:underline">{tr('ดูทั้งหมด', 'View all')}</Link>}
            </div>
            {!me.matching || upcoming.length === 0 ? (
              <p className="rounded-xl bg-surface-2 p-4 text-sm text-muted">
                {me.matching ? tr('ยังไม่มีนัดหมาย เริ่มจากค้นหา Buyer ที่เหมาะกับร้านคุณ', 'No meetings yet. Start by finding buyers that fit your shop.') : tr('ร้านของคุณยังไม่ได้เข้าร่วม Business Matching', 'Your shop has not joined Business Matching')}
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {upcoming.map((m) => {
                  const b = BUYER_BY_ID[m.buyerId]
                  return (
                    <li key={m.id} className="flex items-center gap-4 py-3">
                      <div className="w-16 text-center"><div className="text-lg font-extrabold tabular-nums text-brand">{m.time}</div><div className="text-xs text-muted">Day {m.day}</div></div>
                      <OrgAvatar org={b} size="sm" />
                      <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.name}</div><div className="text-xs text-muted">{L(OBJECTIVES[m.objective])} · Table {m.table}</div></div>
                      <MeetingStatusBadge status={m.status} />
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>

          {me.matching && recommended.length > 0 && (
            <Card className="p-5 sm:p-6">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div><h2 className="text-lg font-bold">{tr('Buyer ที่แนะนำสำหรับร้านคุณ', 'Recommended buyers')}</h2><p className="text-sm text-muted">{tr('เรียงตามความเหมาะสมกับหมวดสินค้า', 'Sorted by fit with your category')}</p></div>
                <Link to="/portal/matching" className="text-sm font-semibold text-brand hover:underline">{tr('ค้นหา Buyer ทั้งหมด', 'All buyers')}</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {recommended.map(({ b, score }) => (
                  <Link key={b.id} to={`/portal/matching/request/${b.id}`} className="flex items-center gap-3 rounded-xl border border-line p-3 hover:border-brand/50">
                    <OrgAvatar org={b} size="sm" />
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.name}</div><div className="text-xs text-muted">{L(b.country)}</div></div>
                    <div className="text-right"><div className="font-extrabold text-success">{score}%</div><div className="text-[11px] text-muted">match</div></div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">{tr('ความพร้อมก่อนวันงาน', 'Event readiness')}</h2>
            <div className="mt-3 h-2 rounded-full bg-surface-2"><div className="gold-gradient h-2 rounded-full" style={{ width: `${(done / checklist.length) * 100}%` }} /></div>
            <ul className="mt-2 divide-y divide-line">
              {checklist.map((c) => (
                <li key={c.title} className="flex items-start gap-3 py-3">
                  {c.done ? <Check size={16} className="mt-0.5 shrink-0 text-success" /> : <span className="mt-0.5 size-4 shrink-0 rounded-full border-2 border-line" />}
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{c.title}</div><div className="text-xs text-muted">{c.desc}</div></div>
                  {!c.done && c.to && <Link to={c.to} className="shrink-0 text-sm font-semibold text-brand hover:underline">{c.cta}</Link>}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold">{tr('บูธของคุณ', 'Your booth')}</h2>
            <div className="mt-3 grid gap-3 text-sm">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-muted" /><span><b>{tr('บูธ', 'Booth')} {me.booth}</b> · {PAVILIONS[me.pavilion].name}{me.status === 'pending' ? ` (${tr('รอยืนยัน', 'pending')})` : ''}</span></div>
              <div className="flex items-center gap-2"><CalendarDays size={16} className="text-muted" /><span>{L(EVENT.dateLabel)} · {EVENT.hours}</span></div>
              <div className="flex items-center gap-2"><ClipboardList size={16} className="text-muted" /><span>{L(EVENT.venue)}</span></div>
            </div>
            <LinkButton to={`/floorplan?zone=${me.pavilion}`} variant="secondary" className="mt-4 w-full" icon={<MapPin size={16} />}>{tr('ดูผังงาน', 'Floor plan')}</LinkButton>
          </Card>
        </div>
      </div>
    </div>
  )
}
