import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Briefcase, CalendarDays, Clock, GraduationCap, MapPin, QrCode, ShoppingBag, Store, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT, PAVILIONS, STAGES } from '../../data/event'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { LinkButton } from '../../components/ui/Button'
import { Card, SectionTitle } from '../../components/ui/Card'
import { ExhibitorCard } from '../../components/ExhibitorCard'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import type { PavilionId } from '../../data/types'

const SPEAKERS = [
  { name: 'Dr. Pimchanok S.', role: { th: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', en: 'Digital marketing expert' }, color: '#0b3a82' },
  { name: 'Kenji Tanaka', role: { th: 'ผู้นำเข้าอาหาร ประเทศญี่ปุ่น', en: 'Food importer, Japan' }, color: '#7c3aed' },
  { name: 'Mint & Friends', role: { th: 'ครีเอเตอร์สายรีวิวสินค้า', en: 'Product review creators' }, color: '#c2410c' },
  { name: 'Arthit W.', role: { th: 'ผู้ก่อตั้งแฟรนไชส์ 300 สาขา', en: 'Founder, 300-branch franchise' }, color: '#15803d' },
]

const PARTNERS = ['Thai SME Bank', 'ShopNow', 'Siam Retail', 'LogiTH Express', 'PayThai', 'Creative TH']

export default function HomePage() {
  const { tr, L } = useI18n()
  const daysLeft = Math.max(0, Math.ceil((new Date(EVENT.days[0]).getTime() - Date.now()) / 86_400_000))

  const highlights = [
    { icon: ShoppingBag, th: 'ช้อปสินค้า SME กว่า 210 ราย', en: 'Shop 210+ SME brands', dth: 'สินค้าคุณภาพจากทุกภูมิภาค พร้อม e-Catalog ออนไลน์', den: 'Quality goods from every region with an online e-Catalog' },
    { icon: Briefcase, th: 'Business Matching', en: 'Business Matching', dth: 'นัดพบ Buyer ไทยและต่างประเทศกว่า 300 ราย', den: 'Meet 300+ Thai and international buyers' },
    { icon: GraduationCap, th: 'MOC Up Skill', en: 'MOC Up Skill', dth: 'Workshop และสัมมนาเพิ่มทักษะ SME กว่า 40 หัวข้อ', den: '40+ workshops and talks to level up SMEs' },
    { icon: Bot, th: 'Ask MOC AI', en: 'Ask MOC AI', dth: 'ผู้ช่วย AI แนะนำร้านค้า สินค้า และกิจกรรม', den: 'AI assistant recommending shops, products and activities' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span className="size-2 animate-pulse rounded-full bg-accent" />
              {tr('เปิดลงทะเบียนแล้ว · เข้าชมฟรี', 'Registration open · Free admission')}
            </div>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
              MOC Expo <span className="text-accent">2026</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85 sm:text-xl">{L(EVENT.tagline)}</p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:gap-5">
              <span className="flex items-center gap-2"><CalendarDays size={18} className="text-accent" /> {L(EVENT.dateLabel)}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-accent" /> {EVENT.hours}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-accent" /> {L(EVENT.venue)}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/register" variant="accent" size="lg" icon={<QrCode size={20} />}>{tr('ลงทะเบียนเข้างาน', 'Register Now')}</LinkButton>
              <LinkButton to="/exhibitors" size="lg" className="bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
                {tr('ดูผู้ออกบูธ', 'Explore Exhibitors')} <ArrowRight size={18} />
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
              <div className="text-sm text-white/70">{tr('นับถอยหลังสู่วันงาน', 'Countdown to opening')}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tabular-nums">{daysLeft}</span>
                <span className="text-lg text-white/80">{tr('วัน', 'days')}</span>
              </div>
            </div>
            {[
              ['210+', tr('ผู้ประกอบการ SME', 'SME exhibitors')],
              ['300+', tr('Buyer ไทยและต่างชาติ', 'Thai & global buyers')],
              ['5', 'Pavilions'],
              ['40+', tr('กิจกรรม & Workshop', 'Activities & workshops')],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <div className="text-2xl font-extrabold text-accent">{n}</div>
                <div className="text-sm text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 pt-14 sm:px-6">
        {/* Highlights */}
        <section>
          <SectionTitle title={tr('ไฮไลต์ของงาน', 'Event Highlights')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h) => (
              <Card key={h.en} className="p-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-brand"><h.icon size={22} /></div>
                <div className="mt-4 font-bold">{tr(h.th, h.en)}</div>
                <p className="mt-1 text-sm text-muted">{tr(h.dth, h.den)}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Pavilions */}
        <section>
          <SectionTitle title="Pavilions" subtitle={tr('5 โซนหลักที่จัดกลุ่มผู้ประกอบการตามศักยภาพ', 'Five zones grouping SMEs by capability')}
            action={<Link to="/floorplan" className="text-sm font-semibold text-brand hover:underline">{tr('ดูผังงาน', 'View floor plan')} →</Link>} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(PAVILIONS) as PavilionId[]).map((id) => {
              const p = PAVILIONS[id]
              const count = EXHIBITORS.filter((e) => e.pavilion === id).length
              return (
                <Link key={id} to={`/exhibitors?pavilion=${id}`} className="group rounded-2xl p-5 text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(150deg, ${p.color}, ${p.color}d0)` }}>
                  <Store size={22} className="opacity-80" />
                  <div className="mt-6 font-bold">{p.name}</div>
                  <div className="mt-1 text-sm text-white/80">{L(p.desc)}</div>
                  <div className="mt-3 text-xs font-semibold text-white/70">{count} {tr('รายในเดโม', 'in demo')} →</div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured exhibitors */}
        <section>
          <SectionTitle title={tr('ผู้ออกบูธแนะนำ', 'Featured Exhibitors')}
            action={<Link to="/exhibitors" className="text-sm font-semibold text-brand hover:underline">{tr('ดูทั้งหมด', 'View all')} →</Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 5, 7].map((i) => <ExhibitorCard key={EXHIBITORS[i].id} ex={EXHIBITORS[i]} />)}
          </div>
        </section>

        {/* Schedule + Speakers */}
        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <SectionTitle title={tr('กิจกรรมวันแรก', 'Day 1 Highlights')}
              action={<Link to="/schedule" className="text-sm font-semibold text-brand hover:underline">{tr('ดูกำหนดการทั้งหมด', 'Full schedule')} →</Link>} />
            <Card className="divide-y divide-line">
              {SCHEDULE.filter((s) => s.day === 1).slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-14 shrink-0 font-bold tabular-nums text-brand">{s.start}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{L(s.title)}</div>
                    <div className="text-xs text-muted">{L(STAGES[s.stage])}{s.speaker ? ` · ${s.speaker}` : ''}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <div>
            <SectionTitle title={tr('วิทยากร', 'Speakers')} />
            <div className="grid grid-cols-2 gap-3">
              {SPEAKERS.map((s) => (
                <Card key={s.name} className="p-4 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full text-lg font-bold text-white" style={{ background: s.color }}>
                    <Users size={26} />
                  </div>
                  <div className="mt-3 text-sm font-bold">{s.name}</div>
                  <div className="text-xs text-muted">{L(s.role)}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Floor plan teaser */}
        <section>
          <SectionTitle title={tr('ผังงาน', 'Floor Plan')} subtitle={tr('คลิกที่โซนเพื่อดูผู้ออกบูธในพื้นที่', 'Tap a zone to see exhibitors there')}
            action={<Link to="/floorplan" className="text-sm font-semibold text-brand hover:underline">{tr('เปิดผังแบบเต็ม', 'Open full map')} →</Link>} />
          <Link to="/floorplan" className="block"><FloorPlanMap compact /></Link>
        </section>

        {/* CTA */}
        <section className="hero-bg flex flex-col items-start gap-5 rounded-3xl p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{tr('ลงทะเบียนวันนี้ รับ QR เข้างานทันที', 'Register today and get your QR ticket instantly')}</h2>
            <p className="mt-2 text-white/80">{tr('ใช้เวลาไม่ถึง 1 นาที · เข้าชมฟรีตลอด 3 วัน', 'Takes under a minute · Free entry all 3 days')}</p>
          </div>
          <LinkButton to="/register" variant="accent" size="lg" icon={<QrCode size={20} />}>{tr('ลงทะเบียน', 'Register Now')}</LinkButton>
        </section>

        {/* Partners */}
        <section>
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">{tr('ผู้สนับสนุนและพันธมิตร (ตัวอย่าง)', 'Sponsors & Partners (sample)')}</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((p) => (
              <div key={p} className="flex h-16 items-center justify-center rounded-xl border border-line bg-surface text-sm font-bold text-muted">{p}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
