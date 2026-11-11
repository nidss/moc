import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Bot, GraduationCap, Handshake, Map, Radio, Smartphone, Store, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { AGENCIES, EVENT, PARTNERS, STAGES } from '../../data/event'
import { AGENCY_LOGOS, PARTNER_LOGOS } from '../../data/agencyLogos'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { LIVE_PLATFORMS, NEWS, STREAMS } from '../../data/homeContent'
import { ExhibitorCard } from '../../components/ExhibitorCard'
import { Logo } from '../../components/Brand'
import { useTimeLeft } from '../../components/Countdown'
import { Reveal } from '../../components/Reveal'
import { FaqSection, PromoSection, ReplaysSection, StageSection, TravelSection, WorkshopSection } from './HomeExtras'
import { HOME_FEATURED, HOME_SPEAKERS, HOME_ZONES } from './homeShared'
import keyVisual from '../../assets/brand/key-visual.webp'

/** หัวข้อ section ชิดซ้าย พร้อมตัวเลขลำดับแบบ mono */
function NeonTitle({ no, title, action }: { no: string; title: string; action?: { to: string; label: string } }) {
  return (
    <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="font-mono text-xs text-accent">/{no}</div>
        <h2 className="mt-1 text-3xl font-bold sm:text-4xl">{title}</h2>
      </div>
      {action && <Link to={action.to} className="inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">{action.label} <ArrowUpRight size={15} /></Link>}
    </Reveal>
  )
}

/** ตัวนับถอยหลังตัวเลขใหญ่ไล่สีนีออน */
function NeonCountdown() {
  const { tr, lang } = useI18n()
  const t = useTimeLeft(EVENT.startsAt, EVENT.endsAt)
  if (t.state !== 'before') return <div className="gold-text-gradient text-3xl font-bold">{t.state === 'live' ? tr('งานกำลังจัดอยู่ตอนนี้', 'The event is on now') : tr('จบงานแล้ว ขอบคุณที่ร่วมงาน', 'Thank you for joining')}</div>
  const parts = [[String(t.d), tr('วัน', 'DAYS')], [t.pad(t.h), tr('ชม.', 'HRS')], [t.pad(t.m), tr('นาที', 'MIN')], [t.pad(t.s), tr('วินาที', 'SEC')]]
  return (
    <div role="timer" aria-label={tr(`เหลืออีก ${t.d} วัน`, `${t.d} days to go`)} className="flex items-start justify-center gap-2 sm:gap-4">
      {parts.map(([n, l], i) => (
        <div key={l} className="flex items-start gap-2 sm:gap-4" aria-hidden>
          <div className="text-center">
            <div key={n} className="motion-tick gold-text-gradient font-mono text-5xl font-bold tabular-nums sm:text-7xl">{n}</div>
            <div className={`mt-1 text-[11px] text-muted ${lang === 'en' ? 'font-mono tracking-[0.25em]' : 'text-xs'}`}>{l}</div>
          </div>
          {i < 3 && <div className="font-mono text-4xl text-white/20 sm:text-6xl">:</div>}
        </div>
      ))}
    </div>
  )
}

/** ช่องใน bento grid */
function Tile({ to, icon: Icon, title, desc, className = '', children }: { to: string; icon: LucideIcon; title: string; desc?: string; className?: string; children?: ReactNode }) {
  return (
    <Link to={to} className={`ui-card group relative flex flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/60 ${className}`}>
      <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-accent ring-1 ring-white/15 transition-transform group-hover:scale-110"><Icon size={22} /></span>
      <div className="mt-auto pt-6">
        <div className="text-xl font-bold">{title}</div>
        {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
        {children}
      </div>
      <ArrowUpRight size={18} className="absolute top-6 right-6 text-muted transition-colors group-hover:text-accent" />
    </Link>
  )
}

export default function HomeMidnight() {
  const { tr, L, lang } = useI18n()
  const featured = HOME_FEATURED.map((id) => EXHIBITORS.find((e) => e.id === id)!)
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short' })
  const [hub, skill, taste] = HOME_ZONES
  const logos = [...Object.values(AGENCIES).map((a) => ({ k: a.short, src: AGENCY_LOGOS[a.short], alt: L(a.name) })), ...PARTNERS.map((p) => ({ k: p.en, src: PARTNER_LOGOS[p.en], alt: L(p) }))]

  return (
    <div>
      {/* ===== Hero กึ่งกลาง: ตารางเรืองแสง + ตัวนับถอยหลังใหญ่ ===== */}
      <section className="relative -mt-[68px] overflow-hidden pt-[100px] pb-10 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_50%_30%,#000_30%,transparent_75%)]" />
        <div className="motion-glow pointer-events-none absolute top-10 left-[10%] size-[420px] rounded-full bg-[#8b5cf6]/30 blur-[120px]" />
        <div className="motion-glow pointer-events-none absolute top-40 right-[8%] size-[360px] rounded-full bg-[#22d3ee]/20 blur-[120px] [animation-delay:-2.5s]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="motion-rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs text-muted">
            <span className="size-2 animate-pulse rounded-full bg-accent" /> 04–06.12.2026 · QSNCC HALL 7–8 · {tr('เข้าชมฟรี', 'FREE ENTRY')}
          </div>
          <div className="motion-rise mt-8 flex justify-center [--delay:80ms]"><Logo className="h-32 sm:h-40" /></div>
          <h1 className="motion-rise mx-auto mt-8 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl [--delay:160ms]">{L(EVENT.tagline)}</h1>
          <div className="motion-rise mt-10 [--delay:240ms]"><NeonCountdown /></div>
          <div className="motion-rise mt-10 flex flex-wrap justify-center gap-3 [--delay:320ms]">
            <Link to="/register" className="motion-shine gold-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-on-accent shadow-[0_0_30px_rgba(34,211,238,0.35)]">{tr('ลงทะเบียนเข้างาน', 'Register now')} <ArrowRight size={18} /></Link>
            <Link to="/exhibitors" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold hover:bg-white/10">{tr('ดูผู้ออกบูธ', 'Explore exhibitors')}</Link>
          </div>
          <div className="motion-pop relative mx-auto mt-14 max-w-3xl [--delay:400ms]">
            <div className="absolute inset-[10%] rounded-full bg-[#8b5cf6]/40 blur-[80px]" />
            <img src={keyVisual} width={1400} height={823} alt={tr('คีย์วิชวลงาน', 'Event key visual')} className="motion-float relative w-full select-none" draggable={false} />
          </div>
        </div>
      </section>

      {/* ===== Bento grid: โซนและบริการ ===== */}
      <section id="zones" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <NeonTitle no="01" title={tr('สำรวจงาน', 'Explore the expo')} action={{ to: '/floorplan', label: tr('ผังงาน', 'Floor plan') }} />
        <Reveal group className="grid auto-rows-[190px] gap-4 md:grid-cols-4">
          <Tile to={hub.to} icon={Store} title={hub.name} desc={L(hub.desc)} className="bg-[linear-gradient(135deg,rgba(139,92,246,0.35),transparent_60%)] md:col-span-2 md:row-span-2">
            <div className="mt-3 text-sm font-semibold text-accent">{L(hub.title)}</div>
          </Tile>
          <Tile to={skill.to} icon={GraduationCap} title={skill.name} desc={L(skill.title)} className="bg-[linear-gradient(135deg,rgba(34,211,238,0.22),transparent_60%)] md:col-span-2" />
          <Link to={taste.to} className="group relative overflow-hidden rounded-3xl border border-white/10 md:col-span-1">
            <img src={`${import.meta.env.BASE_URL}images/exhibitors/khao-soi-chef/banner.webp`} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <UtensilsCrossed size={18} className="text-accent" />
              <div className="mt-2 text-lg font-bold">{taste.name}</div>
              <div className="text-xs text-white/70">{L(taste.title)}</div>
            </div>
          </Link>
          <Tile to="/portal/matching" icon={Handshake} title="Business Matching" />
          <Tile to="/schedule" icon={Radio} title="Live Commerce" className="md:col-span-2">
            <div className="mt-3 flex flex-wrap gap-1.5">{LIVE_PLATFORMS.map((p) => <span key={p} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs"><Smartphone size={11} /> {p}</span>)}</div>
          </Tile>
          <Tile to="/ai" icon={Bot} title="Ask MOC AI" desc={tr('ผู้ช่วย AI ประจำงาน', 'Your event AI assistant')} />
          <Tile to="/floorplan" icon={Map} title={tr('ผังงาน', 'Floor plan')} />
        </Reveal>
      </section>

      {/* ===== ข่าว: ฟีดเลื่อนแนวนอน + การ์ดไลฟ์ ===== */}
      <section id="news" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <NeonTitle no="02" title={tr('ข่าว & Live Streaming', 'News & Live')} />
        <Reveal className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          <div className="relative w-[300px] shrink-0 snap-start overflow-hidden rounded-3xl border border-accent/40 bg-[linear-gradient(160deg,rgba(139,92,246,0.45),rgba(34,211,238,0.15))] p-6 shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)] sm:w-[340px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white"><span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE</span>
            <div className="mt-4 font-mono text-xs text-muted">{tr('ถ่ายทอดสดครั้งถัดไป', 'NEXT STREAM')}</div>
            <div className="mt-1 text-xl font-bold">{L(STREAMS[0].title)}</div>
            <div className="text-accent">{L(STREAMS[0].when)}</div>
            <ul className="mt-5 space-y-1.5 text-sm text-muted">{STREAMS.slice(1).map((s) => <li key={s.title.en}>▸ {L(s.title)} · {L(s.when)}</li>)}</ul>
          </div>
          {NEWS.map((n) => (
            <article key={n.date} className="ui-card w-[280px] shrink-0 snap-start rounded-3xl border p-6 sm:w-[300px]">
              <div className="flex items-center justify-between font-mono text-xs"><span className="text-accent">#{L(n.tag)}</span><span className="text-muted">{fmtDate(n.date)}</span></div>
              <h3 className="mt-4 text-lg font-bold leading-snug">{L(n.title)}</h3>
              <p className="mt-2 text-sm text-muted">{L(n.excerpt)}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* ===== ผู้ออกบูธ ===== */}
      <section id="exhibitors" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <NeonTitle no="03" title={tr('ผู้ออกบูธแนะนำ', 'Featured exhibitors')} action={{ to: '/exhibitors', label: tr('ดูทั้งหมด', 'View all') }} />
        <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((e) => <ExhibitorCard key={e.id} ex={e} />)}
        </Reveal>
      </section>

      {/* ===== กำหนดการ + วิทยากร ===== */}
      <section id="programme" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <NeonTitle no="04" title={tr('กิจกรรมวันแรก', 'Day 1 lineup')} action={{ to: '/schedule', label: tr('กำหนดการทั้งหมด', 'Full schedule') }} />
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Reveal group className="space-y-2">
            {SCHEDULE.filter((s) => s.day === 1).slice(0, 5).map((s) => (
              <div key={s.id} className="ui-card flex items-center gap-4 rounded-2xl border px-4 py-3">
                <span className="rounded-lg bg-accent/15 px-2.5 py-1 font-mono text-sm font-bold text-accent tabular-nums">{s.start}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{L(s.title)}</div>
                  <div className="truncate text-xs text-muted">{L(STAGES[s.stage])}{s.speaker ? ` · ${s.speaker}` : ''}</div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal group className="grid grid-cols-2 gap-2">
            {HOME_SPEAKERS.map((s) => (
              <div key={s.name} className="ui-card rounded-2xl border p-4">
                <span className="gold-gradient flex size-10 items-center justify-center rounded-xl font-bold text-on-accent">{s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}</span>
                <div className="mt-3 text-sm font-bold">{s.name}</div>
                <div className="text-xs text-muted">{L(s.role)}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ===== ส่วนกิจกรรม/บริการ (ใช้ร่วมกัน ปรับสีตามธีม) ===== */}
      <WorkshopSection />
      <StageSection />
      <PromoSection />
      <TravelSection />
      <ReplaysSection />
      <FaqSection />

      {/* ===== CTA ขอบไล่สี ===== */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="rounded-[2rem] bg-[linear-gradient(120deg,#22d3ee,#8b5cf6,#c084fc)] p-px">
          <div className="flex flex-col items-center gap-5 rounded-[calc(2rem-1px)] bg-[var(--bg)] px-6 py-12 text-center">
            <div className="font-mono text-xs tracking-[0.3em] text-accent">{L(EVENT.slogan)}</div>
            <h2 className="max-w-3xl text-3xl font-bold leading-snug sm:text-4xl">“{L(EVENT.quote)}”</h2>
            <Link to="/register" className="motion-shine gold-gradient inline-flex items-center gap-2 rounded-full px-8 py-3.5 font-bold text-on-accent">{tr('ลงทะเบียนเลย', 'Register now')} <ArrowRight size={18} /></Link>
          </div>
        </Reveal>
      </section>

      {/* ===== หน่วยงานร่วมจัด: โลโก้เลื่อนวน ===== */}
      <section id="organisers" className="py-10">
        <div className="mx-auto mb-6 max-w-6xl px-4 font-mono text-xs tracking-[0.3em] text-muted sm:px-6">{tr('หน่วยงานร่วมจัด & พันธมิตร', 'ORGANISERS & PARTNERS')}</div>
        <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <div className="marquee-track gap-4 pr-4 [--marquee-speed:45s]">
            {[...logos, ...logos].map((x, i) => (
              <div key={i} className="flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl bg-white p-3" title={x.alt}>
                <img src={x.src} alt={i < logos.length ? x.alt : ''} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
