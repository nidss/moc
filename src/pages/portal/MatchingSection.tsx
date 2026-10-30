import { CalendarClock, Check, ClipboardEdit, Search, Sparkles } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYERS } from '../../data/buyers'
import { useDemoStore } from '../../store/demoStore'
import { usePortalMe } from '../../store/selectors'
import { buyerScore } from '../../lib/catalog'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button, LinkButton } from '../../components/ui/Button'
import { OrgAvatar } from '../../components/Brand'

/** หน้าแนะนำสำหรับร้านที่ยังไม่ได้เข้าร่วม Business Matching */
function OptIn() {
  const { tr, L } = useI18n()
  const me = usePortalMe()
  const updateShop = useDemoStore((s) => s.updateShop)
  const countries = new Set(BUYERS.flatMap((b) => b.country.en.split(' / '))).size
  const teaser = BUYERS.map((b) => ({ b, score: buyerScore(me, b) })).sort((a, b) => b.score - a.score)
  const perks = [
    [Search, tr(`Buyer ${BUYERS.length} ราย จาก ${countries} ประเทศ`, `${BUYERS.length} buyers from ${countries} countries`), tr('ค้าปลีก ผู้นำเข้า โรงแรม และอีคอมเมิร์ซ', 'Retail, importers, hotels and e-commerce')],
    [Sparkles, tr('จับคู่ตามสินค้าของคุณ', 'Matched to your products'), tr('ระบบเรียง Buyer ตามความเหมาะสมกับหมวดสินค้าของร้าน', 'Buyers are ranked by fit with your category')],
    [CalendarClock, tr('นัดเจรจา 30 นาที', '30-minute meetings'), tr('ที่ Business Matching Lounge ระหว่างวันงาน', 'At the Business Matching Lounge during the event')],
    [ClipboardEdit, tr('บันทึกผลและมูลค่าดีล', 'Record results and deal value'), tr('ติดตามผลหลังประชุมได้ในที่เดียว', 'Follow up after each meeting in one place')],
  ] as const

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <Card className="p-6 sm:p-8">
        <Badge tone="neutral" dot>{tr('ยังไม่ได้เข้าร่วม', 'Not joined')}</Badge>
        <h2 className="mt-4 text-2xl font-bold">{tr('เจรจาธุรกิจกับ Buyer ในงาน MOC Expo 2026', 'Meet buyers at MOC Expo 2026')}</h2>
        <p className="mt-2 text-muted">{tr('ร้านของคุณเลือกไม่เข้าร่วม Business Matching ไว้ · เปลี่ยนใจได้ตลอดก่อนวันงาน เข้าร่วมแล้วค้นหา Buyer และขอนัดได้ทันที', 'Your shop opted out of Business Matching · you can join any time before the event and start booking right away')}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {perks.map(([Icon, t, d]) => (
            <div key={t} className="flex items-start gap-3">
              <span className="rounded-xl bg-brand-soft p-2.5 text-brand"><Icon size={18} /></span>
              <div><div className="font-semibold">{t}</div><div className="text-sm text-muted">{d}</div></div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          <Button variant="accent" icon={<Check size={16} />} onClick={() => updateShop(me.id, { matching: true })}>{tr('เข้าร่วม Business Matching', 'Join Business Matching')}</Button>
          <LinkButton to="/portal" variant="secondary">{tr('ไว้ทีหลัง', 'Maybe later')}</LinkButton>
          <span className="text-xs text-muted">{tr('เปลี่ยนได้ที่แท็บ ข้อมูลร้านค้า', 'You can change this in Shop info')}</span>
        </div>
      </Card>
      <Card className="self-start p-5">
        <div className="text-sm font-semibold">{tr('Buyer ที่เหมาะกับร้านคุณ', 'Buyers that fit your shop')}</div>
        <div className="mt-3 space-y-2">
          {teaser.slice(0, 3).map(({ b, score }) => (
            <div key={b.id} className="flex items-center gap-3 rounded-xl border border-line p-3">
              <OrgAvatar org={b} size="sm" />
              <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{b.name}</div><div className="text-xs text-muted">{L(b.country)} · {L(b.type)}</div></div>
              <div className="text-right"><div className="font-extrabold text-success">{score}%</div><div className="text-[11px] text-muted">match</div></div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-surface-2 p-3 text-center text-sm text-muted">{tr(`และอีก ${teaser.length - 3} ราย · เข้าร่วมเพื่อดูทั้งหมดและขอนัด`, `and ${teaser.length - 3} more · join to see all and book`)}</div>
      </Card>
    </div>
  )
}

/** แท็บ Business Matching ใน SME Portal: แสดงหน้าเข้าร่วมถ้ายังไม่เข้าร่วม ไม่งั้นเป็นค้นหา Buyer / นัดหมายของฉัน */
export default function MatchingSection() {
  const { tr } = useI18n()
  const me = usePortalMe()
  const upcoming = useDemoStore((s) => s.myMeetings.filter((m) => m.exhibitorId === me.id && (m.status === 'pending' || m.status === 'confirmed')).length)

  if (!me.matching) return <OptIn />

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav className="inline-flex gap-1 rounded-xl border border-line bg-surface-2 p-1">
          {[
            { to: '/portal/matching', end: true, icon: Search, label: tr('ค้นหา Buyer', 'Discover Buyers') },
            { to: '/portal/matching/meetings', icon: CalendarClock, label: tr('นัดหมายของฉัน', 'My Meetings'), count: upcoming },
          ].map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}
              className={({ isActive }) => `inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold ${isActive ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-fg'}`}>
              <t.icon size={16} /> {t.label}
              {!!t.count && <span className="rounded-full bg-accent px-1.5 text-[11px] text-on-accent">{t.count}</span>}
            </NavLink>
          ))}
        </nav>
        <span className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Badge tone="success" dot>{tr('เข้าร่วม Business Matching', 'Joined Business Matching')}</Badge>
          {tr('เปลี่ยนได้ที่แท็บ ข้อมูลร้านค้า', 'Change this in Shop info')}
        </span>
      </div>
      <Outlet />
    </div>
  )
}
