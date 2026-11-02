import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Briefcase, CalendarDays, Clock, Flower2, GraduationCap, Handshake, MapPin, Mic2, QrCode, Store, Users, UtensilsCrossed } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { AGENCIES, EVENT, PARTNERS, STAGES } from '../../data/event'
import { AGENCY_LOGOS, PARTNER_LOGOS } from '../../data/agencyLogos'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { LinkButton } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ExhibitorCard } from '../../components/ExhibitorCard'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import { Logo } from '../../components/Brand'
import { Countdown } from '../../components/Countdown'
import { Reveal } from '../../components/Reveal'
import { Band, BandLink, BandTitle } from '../../components/Band'
import { HomeExtras, NewsSection } from './HomeExtras'
import heroBg from '../../assets/brand/hero-bg.webp'
import keyVisual from '../../assets/brand/key-visual.webp'

const SPEAKERS = [
  { name: 'Dr. Pimchanok S.', role: { th: 'ผู้เชี่ยวชาญการตลาดดิจิทัล', en: 'Digital marketing expert' } },
  { name: 'Kenji Tanaka', role: { th: 'ผู้นำเข้าอาหาร ประเทศญี่ปุ่น', en: 'Food importer, Japan' } },
  { name: 'Mint & Friends', role: { th: 'อินฟลูเอนเซอร์สายรีวิวสินค้า', en: 'Product review influencers' } },
  { name: 'Arthit W.', role: { th: 'ผู้ก่อตั้งแบรนด์ 300 สาขา', en: 'Founder, 300-branch brand' } },
]

export default function HomePage() {
  const { lang, tr, L, fmtNumber } = useI18n()

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
    { icon: Handshake, th: 'Business Matching Lounge', en: 'Business Matching Lounge', dth: 'เจรจาธุรกิจกับหน่วยงานพันธมิตร', den: 'Negotiate with partner organisations', to: '/portal/matching' },
    { icon: Flower2, th: 'Workshop', en: 'Workshops', dth: 'สมุนไพรไทย พับดอกไม้ เครื่องดื่มสมุนไพร', den: 'Herbal products, flowers, herbal drinks', to: '/schedule' },
    { icon: Briefcase, th: 'Private Pavilion', en: 'Private Pavilion', dth: 'Modern Trade เทคโนโลยี การเงิน สื่อสาร สุขภาพ', den: 'Modern trade, tech, finance, telecom, health', to: '/exhibitors?pavilion=private' },
    { icon: Bot, th: 'Ask MOC AI', en: 'Ask MOC AI', dth: 'ผู้ช่วย AI แนะนำร้าน สินค้า และกิจกรรม', den: 'AI assistant for shops, products & activities', to: '/ai' },
  ]

  const featured = ['thai-organic-farm', 'lanna-coffee', 'khao-soi-chef', 'indigo-weave'].map((id) => EXHIBITORS.find((e) => e.id === id)!)

  return (
    <div>
      {/* Hero: ภาพพื้นหลังลูกโลก/เมือง + โลโก้และข้อมูลงาน (ซ้าย) + คีย์วิชวลริบบิ้นอินฟินิตี้ (ขวา) */}
      <section className="relative overflow-hidden bg-navy text-white">
        {/* ภาพพื้นหลังลูกโลก/เมือง (อยู่นิ่ง ไม่มีแอนิเมชัน) */}
        <div className="pointer-events-none absolute inset-0 bg-cover bg-right-bottom" style={{ backgroundImage: `url(${heroBg})` }} />
        {/* ไล่สีกรมท่าทับภาพพื้นหลัง ให้ข้อความอ่านง่าย (มือถือทึบกว่าเพราะข้อความทับเมือง/ลูกโลก) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#001848]/75 via-[#001848]/55 to-[#001848]/35 lg:bg-gradient-to-r lg:from-[#001848]/55 lg:via-[#001848]/10 lg:to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-6">
            <div>
              <div className="motion-rise"><Logo tone="light" className="h-36 sm:h-44" /></div>
              <h1 className="motion-rise mt-6 max-w-xl [--delay:120ms] text-2xl font-semibold leading-snug sm:text-3xl">{L(EVENT.tagline)}</h1>
              <div className="motion-rise mt-5 flex flex-col gap-2 text-sm text-white/85 [--delay:220ms] sm:flex-row sm:flex-wrap sm:gap-5">
                <span className="flex items-center gap-2"><CalendarDays size={18} className="text-gold-light" /> {L(EVENT.dateLabel)}</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-gold-light" /> {EVENT.hours}</span>
                <span className="flex items-center gap-2"><MapPin size={18} className="text-gold-light" /> {L(EVENT.venue)}</span>
              </div>
              <div className="motion-rise mt-8 flex flex-wrap gap-3 [--delay:320ms]">
                <LinkButton to="/register" variant="accent" size="lg" className="motion-shine" icon={<QrCode size={20} />}>{tr('ลงทะเบียนเข้างาน', 'Register Now')}</LinkButton>
                <LinkButton to="/exhibitors" size="lg" className="bg-white/10 text-white! ring-1 ring-white/30 hover:bg-white/20">
                  {tr('ดูผู้ออกบูธ', 'Explore Exhibitors')} <ArrowRight size={18} />
                </LinkButton>
              </div>
            </div>
            {/* คีย์วิชวล: เด้งเข้า แล้วลอยขึ้นลงช้า ๆ พร้อมแสงทองด้านหลัง */}
            <div className="motion-pop relative mx-auto w-full max-w-2xl [--delay:250ms] lg:max-w-none">
              <div className="motion-glow pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(232,189,92,0.45),rgba(40,110,220,0.25),transparent)] blur-2xl" />
              <img src={keyVisual} width={1400} height={823} decoding="async"
                alt={tr('คีย์วิชวลงาน: สินค้าไทย การขายออนไลน์ การค้าระหว่างประเทศ และเวทีความรู้ด้าน AI', 'Event key visual: Thai products, live commerce, global trade and AI talks')}
                className="motion-float relative w-full select-none drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]" draggable={false} />
            </div>
          </div>
          {/* นับถอยหลังสู่วันงาน (เวลาจริง) */}
          <div className="motion-rise mt-10 flex flex-col gap-5 rounded-2xl bg-[#001848]/60 [--delay:450ms] p-5 ring-1 ring-white/20 backdrop-blur-md sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-semibold">{tr('นับถอยหลังสู่วันงาน', 'Countdown to opening')}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/20">{tr('เข้าชมฟรี', 'Free entry')}</span>
              </div>
              <div className="mt-1 text-sm text-white/70">{tr(`เปิดงาน ${L(EVENT.dateLabel)} เวลา ${EVENT.hours} น.`, `Opens ${L(EVENT.dateLabel)}, ${EVENT.hours}`)}</div>
            </div>
            <Countdown startsAt={EVENT.startsAt} endsAt={EVENT.endsAt} />
          </div>
        </div>
        <div className="gold-bar-flow relative h-1" />
      </section>

      {/* แต่ละ section เป็นแถบเต็มความกว้าง สลับสีพื้นหลังเพื่อแบ่งหัวข้อให้ชัด */}
      <div>
        {/* 3 zones */}
        <Band id="zones">
          <BandTitle eyebrow="EXPLORE" title={tr('3 โซนหลักของงาน', 'Three Main Zones')} subtitle={tr(`พื้นที่จัดงานไม่น้อยกว่า ${fmtNumber(EVENT.area)} ตารางเมตร`, `At least ${fmtNumber(EVENT.area)} sqm of exhibition space`)}
            action={<BandLink to="/floorplan">{tr('ดูผังงาน', 'View floor plan')}</BandLink>} />
          <Reveal group className="grid gap-4 lg:grid-cols-3">
            {zones.map((z) => (
              <Link key={z.no} to={z.to} className="group relative overflow-hidden rounded-2xl bg-navy p-6 text-white ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#001848]/30">
                <div className="hero-net pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">{tr('โซนที่', 'Zone')} {z.no}</span>
                  <span className="gold-gradient flex size-11 items-center justify-center rounded-xl text-navy transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><z.icon size={22} /></span>
                </div>
                <div className="relative mt-6 text-2xl font-bold tracking-tight">{z.name}</div>
                <div className="relative text-sm font-semibold text-gold-light">{tr(z.th, z.en)}</div>
                <p className="relative mt-3 text-sm leading-relaxed text-white/75">{tr(z.dth, z.den)}</p>
                <div className="relative mt-4 text-xs font-semibold text-white/60 group-hover:text-white">{tr('ดูเพิ่มเติม', 'Learn more')} →</div>
              </Link>
            ))}
          </Reveal>
          <Reveal group className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((h) => (
              <Link key={h.en} to={h.to} className="group">
                <Card className="flex h-full items-start gap-3 p-4 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <div className="rounded-xl bg-brand-soft p-2.5 text-brand transition-transform duration-300 group-hover:scale-110"><h.icon size={20} /></div>
                  <div>
                    <div className="font-semibold">{tr(h.th, h.en)}</div>
                    <p className="text-sm text-muted">{tr(h.dth, h.den)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </Reveal>
        </Band>

        {/* ข่าวประชาสัมพันธ์ & Live Streaming */}
        <NewsSection />

        {/* Featured exhibitors */}
        <Band tone="tint" id="exhibitors">
          <BandTitle eyebrow="EXHIBITORS" title={tr('ผู้ออกบูธแนะนำ', 'Featured Exhibitors')}
            action={<BandLink to="/exhibitors">{tr('ดูทั้งหมด', 'View all')}</BandLink>} />
          <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((e) => <ExhibitorCard key={e.id} ex={e} />)}
          </Reveal>
        </Band>

        {/* Schedule + Speakers */}
        <Band id="programme">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <BandTitle eyebrow="PROGRAMME" title={tr('กิจกรรมวันแรก', 'Day 1 Highlights')}
                action={<BandLink to="/schedule">{tr('ดูกำหนดการทั้งหมด', 'Full schedule')}</BandLink>} />
              <Reveal>
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
              </Reveal>
            </div>
            <div>
              <BandTitle eyebrow="SPEAKERS" title={tr('วิทยากร & อินฟลูเอนเซอร์', 'Speakers & Influencers')} />
              <Reveal group className="grid grid-cols-2 gap-3">
                {SPEAKERS.map((s) => (
                  <Card key={s.name} className="group p-4 text-center transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-navy text-gold-light ring-2 ring-gold/60 transition duration-300 group-hover:scale-105 group-hover:ring-4">
                      <Mic2 size={24} />
                    </div>
                    <div className="mt-3 text-sm font-bold">{s.name}</div>
                    <div className="text-xs text-muted">{L(s.role)}</div>
                  </Card>
                ))}
              </Reveal>
            </div>
          </div>
        </Band>

        {/* Floor plan teaser */}
        <Band tone="white" id="floorplan">
          <BandTitle eyebrow="FLOOR PLAN" title={tr('ผังงาน', 'Floor Plan')} subtitle={L(EVENT.venue)}
            action={<BandLink to="/floorplan">{tr('เปิดผังแบบเต็ม', 'Open full map')}</BandLink>} />
          <Reveal><Link to="/floorplan" className="block"><FloorPlanMap compact /></Link></Reveal>
        </Band>

        {/* Workshop, เวทีกลาง, โปรโมชั่น, การเดินทาง, ข่าว/Live, คลิป, FAQ */}
        <HomeExtras />

        {/* Quote + CTA */}
        <Band>
          <Reveal>
            <section className="hero-bg relative overflow-hidden rounded-3xl p-8 text-white sm:p-10">
              <div className="hero-net pointer-events-none absolute inset-0" />
              <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className={`font-bold text-gold-light ${lang === 'en' ? 'text-xs uppercase tracking-[0.2em]' : 'text-sm'}`}>{L(EVENT.slogan)}</div>
                  <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-snug sm:text-3xl">“{L(EVENT.quote)}”</h2>
                </div>
                <LinkButton to="/register" variant="accent" size="lg" className="motion-shine" icon={<QrCode size={20} />}>{tr('ลงทะเบียน', 'Register Now')}</LinkButton>
              </div>
            </section>
          </Reveal>
        </Band>

        {/* Organisers */}
        <Band tone="white" id="organisers">
          <BandTitle eyebrow="ORGANISERS" title={tr('หน่วยงานร่วมจัด', 'Organising Agencies')} subtitle={tr('หน่วยงานในสังกัดกระทรวงพาณิชย์ 9 หน่วยงาน และหน่วยงานพันธมิตร 5 หน่วยงาน', '9 Ministry of Commerce agencies and 5 partner organisations')} />
          <Reveal group className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {Object.values(AGENCIES).map((a) => (
              <div key={a.short} className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-white p-2">
                  <img src={AGENCY_LOGOS[a.short]} alt={L(a.name)} width={160} height={64} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                </div>
                <span className="text-xs leading-relaxed text-muted">{L(a.name)}</span>
              </div>
            ))}
          </Reveal>
          <div className="mt-6">
            <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted"><Users size={14} /> {tr('พันธมิตร', 'Partners')}</span>
            <Reveal group className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {PARTNERS.map((p) => (
                <div key={p.en} className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-4 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-white p-2">
                    <img src={PARTNER_LOGOS[p.en]} alt={L(p)} width={160} height={64} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                  </div>
                  <span className="text-xs leading-relaxed text-muted">{L(p)}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </Band>
      </div>
    </div>
  )
}
