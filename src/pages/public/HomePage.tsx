import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Briefcase, CalendarDays, Clock, Flower2, GraduationCap, Handshake, MapPin, Mic2, QrCode, Store, Users, UtensilsCrossed } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { AGENCIES, EVENT, PARTNERS, STAGES } from '../../data/event'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { LinkButton } from '../../components/ui/Button'
import { Card, SectionTitle } from '../../components/ui/Card'
import { ExhibitorCard } from '../../components/ExhibitorCard'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import { Logo } from '../../components/Brand'
import heroBg from '../../assets/brand/hero-bg.webp'

const SPEAKERS = [
  { name: 'Dr. Pimchanok S.', role: { th: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', en: 'Digital marketing expert' } },
  { name: 'Kenji Tanaka', role: { th: 'ผู้นำเข้าอาหาร ประเทศญี่ปุ่น', en: 'Food importer, Japan' } },
  { name: 'Mint & Friends', role: { th: 'อินฟลูเอนเซอร์สายรีวิวสินค้า', en: 'Product review influencers' } },
  { name: 'Arthit W.', role: { th: 'ผู้ก่อตั้งแบรนด์ 300 สาขา', en: 'Founder, 300-branch brand' } },
]

export default function HomePage() {
  const { tr, L, fmtNumber } = useI18n()
  const daysLeft = Math.max(0, Math.ceil((new Date(EVENT.days[0]).getTime() - Date.now()) / 86_400_000))

  const zones = [
    {
      no: '1', icon: Store, name: 'MOC HUB', to: '/exhibitors?pavilion=hub',
      th: 'Pavilion สินค้าและบริการให้คำปรึกษา', en: 'Products & advisory pavilion',
      dth: 'จัดแสดงและจำหน่ายสินค้าจาก 9 หน่วยงานกระทรวงพาณิชย์ ผู้ประกอบการ 200 ราย พร้อมบริการให้คำปรึกษาจาก 14 หน่วยงาน',
      den: 'Products from 200 SMEs under 9 MOC agencies, plus advisory services from 14 agencies',
    },
    {
      no: '2', icon: GraduationCap, name: 'MOC UP SKILL', to: '/schedule',
      th: 'เสริมทักษะ องค์ความรู้ และสาระบันเทิง', en: 'Skills, knowledge & edutainment',
      dth: 'เวทีถ่ายทอดความรู้จากผู้เชี่ยวชาญและอินฟลูเอนเซอร์ ตั้งแต่คอนเทนต์ การตลาด สร้างแบรนด์ ถึงการดึงดูดนักลงทุน',
      den: 'Talks from experts and influencers: content, marketing, branding, trends and attracting investors',
    },
    {
      no: '3', icon: UtensilsCrossed, name: 'MOC TASTE', to: '/exhibitors?pavilion=taste',
      th: 'ช้อปชิมอาหารเด็ด', en: 'Shop & taste signature food',
      dth: 'ร้านอาหารและเครื่องดื่มชื่อดัง 100 บูธ ทั้งร้านรางวัล ร้านดารา ร้านอินฟลูเอนเซอร์ และร้านเชฟชื่อดัง',
      den: '100 famous food & drink booths: award winners, celebrity, influencer and chef shops',
    },
  ]

  const more = [
    { icon: Handshake, th: 'Business Matching Lounge', en: 'Business Matching Lounge', dth: 'เจรจาธุรกิจกับหน่วยงานพันธมิตร', den: 'Negotiate with partner organisations', to: '/matching' },
    { icon: Flower2, th: 'Workshop', en: 'Workshops', dth: 'สมุนไพรไทย พับดอกไม้ เครื่องดื่มสมุนไพร', den: 'Herbal products, flowers, herbal drinks', to: '/schedule' },
    { icon: Briefcase, th: 'Private Pavilion', en: 'Private Pavilion', dth: 'Modern Trade เทคโนโลยี การเงิน สื่อสาร สุขภาพ', den: 'Modern trade, tech, finance, telecom, health', to: '/exhibitors?pavilion=private' },
    { icon: Bot, th: 'Ask MOC AI', en: 'Ask MOC AI', dth: 'ผู้ช่วย AI แนะนำร้าน สินค้า และกิจกรรม', den: 'AI assistant for shops, products & activities', to: '/ai' },
  ]

  const featured = ['thai-organic-farm', 'lanna-coffee', 'khao-soi-chef', 'indigo-weave'].map((id) => EXHIBITORS.find((e) => e.id === id)!)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy bg-cover bg-right-bottom text-white" style={{ backgroundImage: `url(${heroBg})` }}>
        {/* ไล่สีกรมท่าทับภาพพื้นหลัง ให้ข้อความอ่านง่าย (มือถือทึบกว่าเพราะข้อความทับเมือง/ลูกโลก) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#001848]/75 via-[#001848]/55 to-[#001848]/35 lg:bg-gradient-to-r lg:from-[#001848]/55 lg:via-[#001848]/10 lg:to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <Logo tone="light" className="h-24 sm:h-32" />
            <h1 className="mt-6 max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">{L(EVENT.tagline)}</h1>
            <div className="mt-5 flex flex-col gap-2 text-sm text-white/85 sm:flex-row sm:flex-wrap sm:gap-5">
              <span className="flex items-center gap-2"><CalendarDays size={18} className="text-gold-light" /> {L(EVENT.dateLabel)}</span>
              <span className="flex items-center gap-2"><Clock size={18} className="text-gold-light" /> {EVENT.hours}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-gold-light" /> {L(EVENT.venue)}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/register" variant="accent" size="lg" icon={<QrCode size={20} />}>{tr('ลงทะเบียนเข้างาน', 'Register Now')}</LinkButton>
              <LinkButton to="/exhibitors" size="lg" className="bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
                {tr('ดูผู้ออกบูธ', 'Explore Exhibitors')} <ArrowRight size={18} />
              </LinkButton>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-end justify-between rounded-2xl bg-[#001848]/55 p-5 ring-1 ring-white/20 backdrop-blur-md">
              <div>
                <div className="text-sm text-white/70">{tr('นับถอยหลังสู่วันงาน', 'Countdown to opening')}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="gold-text-gradient text-5xl font-extrabold tabular-nums">{daysLeft}</span>
                  <span className="text-lg text-white/80">{tr('วัน', 'days')}</span>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/20">{tr('เข้าชมฟรี', 'Free entry')}</span>
            </div>
            {[
              [fmtNumber(EVENT.targets.participants), tr('ผู้เข้าร่วมงาน', 'Participants')],
              [fmtNumber(EVENT.targets.hubExhibitors), tr('ผู้ประกอบการออกบูธ', 'SME exhibitors')],
              [fmtNumber(EVENT.targets.tasteBooths), tr('บูธอาหาร MOC TASTE', 'MOC TASTE food booths')],
              [`฿${EVENT.targets.economicValue / 1_000_000}M`, tr('เป้ามูลค่าเศรษฐกิจ', 'Economic value target')],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-[#001848]/55 p-4 ring-1 ring-white/20 backdrop-blur-md">
                <div className="gold-text-gradient text-2xl font-extrabold">{n}</div>
                <div className="text-sm text-white/80">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="gold-gradient relative h-1" />
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 pt-14 sm:px-6">
        {/* 3 zones */}
        <section>
          <SectionTitle title={tr('3 โซนหลักของงาน', 'Three Main Zones')} subtitle={tr(`พื้นที่จัดงานไม่น้อยกว่า ${fmtNumber(EVENT.area)} ตารางเมตร`, `At least ${fmtNumber(EVENT.area)} sqm of exhibition space`)}
            action={<Link to="/floorplan" className="text-sm font-semibold text-brand hover:underline">{tr('ดูผังงาน', 'View floor plan')} →</Link>} />
          <div className="grid gap-4 lg:grid-cols-3">
            {zones.map((z) => (
              <Link key={z.no} to={z.to} className="group relative overflow-hidden rounded-2xl bg-navy p-6 text-white ring-1 ring-white/10 transition-transform hover:-translate-y-0.5">
                <div className="hero-net pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">{tr('โซนที่', 'Zone')} {z.no}</span>
                  <span className="gold-gradient flex size-11 items-center justify-center rounded-xl text-navy"><z.icon size={22} /></span>
                </div>
                <div className="relative mt-6 text-2xl font-bold tracking-tight">{z.name}</div>
                <div className="relative text-sm font-semibold text-gold-light">{tr(z.th, z.en)}</div>
                <p className="relative mt-3 text-sm leading-relaxed text-white/75">{tr(z.dth, z.den)}</p>
                <div className="relative mt-4 text-xs font-semibold text-white/60 group-hover:text-white">{tr('ดูเพิ่มเติม', 'Learn more')} →</div>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((h) => (
              <Link key={h.en} to={h.to}>
                <Card className="flex h-full items-start gap-3 p-4 transition-shadow hover:shadow-md">
                  <div className="rounded-xl bg-brand-soft p-2.5 text-brand"><h.icon size={20} /></div>
                  <div>
                    <div className="font-semibold">{tr(h.th, h.en)}</div>
                    <p className="text-sm text-muted">{tr(h.dth, h.den)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured exhibitors */}
        <section>
          <SectionTitle title={tr('ผู้ออกบูธแนะนำ', 'Featured Exhibitors')}
            action={<Link to="/exhibitors" className="text-sm font-semibold text-brand hover:underline">{tr('ดูทั้งหมด', 'View all')} →</Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((e) => <ExhibitorCard key={e.id} ex={e} />)}
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
            <SectionTitle title={tr('วิทยากร & อินฟลูเอนเซอร์', 'Speakers & Influencers')} />
            <div className="grid grid-cols-2 gap-3">
              {SPEAKERS.map((s) => (
                <Card key={s.name} className="p-4 text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-navy text-gold-light ring-2 ring-gold/60">
                    <Mic2 size={24} />
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
          <SectionTitle title={tr('ผังงาน', 'Floor Plan')} subtitle={L(EVENT.venue)}
            action={<Link to="/floorplan" className="text-sm font-semibold text-brand hover:underline">{tr('เปิดผังแบบเต็ม', 'Open full map')} →</Link>} />
          <Link to="/floorplan" className="block"><FloorPlanMap compact /></Link>
        </section>

        {/* Quote + CTA */}
        <section className="hero-bg relative overflow-hidden rounded-3xl p-8 text-white sm:p-10">
          <div className="hero-net pointer-events-none absolute inset-0" />
          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-gold-light">{EVENT.slogan}</div>
              <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-snug sm:text-3xl">“{L(EVENT.quote)}”</h2>
            </div>
            <LinkButton to="/register" variant="accent" size="lg" icon={<QrCode size={20} />}>{tr('ลงทะเบียน', 'Register Now')}</LinkButton>
          </div>
        </section>

        {/* Organisers */}
        <section>
          <SectionTitle title={tr('หน่วยงานร่วมจัด', 'Organising Agencies')} subtitle={tr('หน่วยงานในสังกัดกระทรวงพาณิชย์ 9 หน่วยงาน และหน่วยงานพันธมิตร 5 หน่วยงาน', '9 Ministry of Commerce agencies and 5 partner organisations')} />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.values(AGENCIES).map((a) => (
              <div key={a.short} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-[11px] font-extrabold text-brand">{a.short}</span>
                <span className="text-xs leading-tight text-muted">{L(a.name)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted"><Users size={14} /> {tr('พันธมิตร', 'Partners')}</span>
            {PARTNERS.map((p) => <span key={p.en} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium">{L(p)}</span>)}
          </div>
        </section>
      </div>
    </div>
  )
}
