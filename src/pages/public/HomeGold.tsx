import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Radio } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { AGENCIES, EVENT, PARTNERS, STAGES } from '../../data/event'
import { AGENCY_LOGOS, PARTNER_LOGOS } from '../../data/agencyLogos'
import { EXHIBITORS } from '../../data/exhibitors'
import { SCHEDULE } from '../../data/schedule'
import { NEWS, STREAMS } from '../../data/homeContent'
import { ExhibitorCard } from '../../components/ExhibitorCard'
import { Logo } from '../../components/Brand'
import { useTimeLeft } from '../../components/Countdown'
import { Reveal } from '../../components/Reveal'
import { FaqSection, PromoSection, ReplaysSection, StageSection, TravelSection, WorkshopSection } from './HomeExtras'
import { HOME_FEATURED, HOME_SPEAKERS, HOME_ZONES } from './homeShared'
import keyVisual from '../../assets/brand/key-visual.webp'
import goldMap from '../../assets/brand/hero-gold-map.webp'

/** หัวข้อ section แบบนิตยสาร: ป้ายเล็ก หัวข้อตัวมีเชิงกึ่งกลาง และเส้นประดับทอง */
function GoldTitle({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 text-center">
      <div className="text-xs font-semibold tracking-[0.3em] text-gold-text">{eyebrow}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
      <div className="mx-auto mt-4 flex w-40 items-center gap-2 text-[var(--gold)]" aria-hidden>
        <span className="h-px flex-1 bg-current" /><span className="size-1.5 rotate-45 bg-current" /><span className="h-px flex-1 bg-current" />
      </div>
      {sub && <p className="mx-auto mt-4 max-w-2xl text-muted">{sub}</p>}
    </Reveal>
  )
}

/** ตัวนับถอยหลังแบบเรียบ: ตัวเลขตัวมีเชิงคั่นด้วยเส้นทอง */
function GoldCountdown() {
  const { tr, lang } = useI18n()
  const t = useTimeLeft(EVENT.startsAt, EVENT.endsAt)
  if (t.state !== 'before') return <div className="font-display text-2xl text-gold-light">{t.state === 'live' ? tr('งานกำลังจัดอยู่ตอนนี้', 'The event is on now') : tr('จบงานแล้ว ขอบคุณที่ร่วมงาน', 'Thank you for joining')}</div>
  const parts = [[String(t.d), tr('วัน', 'Days')], [t.pad(t.h), tr('ชั่วโมง', 'Hours')], [t.pad(t.m), tr('นาที', 'Min')], [t.pad(t.s), tr('วินาที', 'Sec')]]
  return (
    <div role="timer" aria-label={tr(`เหลืออีก ${t.d} วัน`, `${t.d} days to go`)} className="flex divide-x divide-[var(--gold-light)]/40 border-y border-[var(--gold-light)]/40">
      {parts.map(([n, l]) => (
        <div key={l} className="flex-1 px-3 py-3 text-center sm:px-5" aria-hidden>
          <div key={n} className="motion-tick font-display text-3xl font-bold tabular-nums sm:text-4xl">{n}</div>
          <div className={`mt-0.5 text-white/60 ${lang === 'en' ? 'text-[11px] tracking-widest uppercase' : 'text-xs'}`}>{l}</div>
        </div>
      ))}
    </div>
  )
}

export default function HomeGold() {
  const { tr, L, lang } = useI18n()
  const featured = HOME_FEATURED.map((id) => EXHIBITORS.find((e) => e.id === id)!)
  const [lead, ...rest] = NEWS
  const fmtDay = (iso: string) => new Date(iso).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric' })
  const fmtMon = (iso: string) => new Date(iso).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { month: 'short' })
  const marquee = ['MOC HUB', 'MOC UP SKILL', 'MOC TASTE', 'BUSINESS MATCHING', 'WORKSHOP', 'LIVE COMMERCE', 'ASK MOC AI']

  return (
    <div>
      {/* ===== Hero: แผนที่โลกสีทองเต็มจอ + ข้อความด้านซ้าย + คีย์วิชวลในกรอบซุ้มโค้ง ===== */}
      <section className="relative overflow-hidden bg-[#0b0905] text-white">
        <img src={goldMap} alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover object-center" />
        {/* ไล่สีเข้มทับแผนที่ให้ข้อความอ่านง่าย (มือถือทึบกว่า) */}
        <div className="pointer-events-none absolute inset-0 bg-[#0b0905]/70 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#0b0905]/92 lg:via-[#0b0905]/55 lg:to-[#0b0905]/15" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b0905]/80 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <div className="motion-rise text-xs font-semibold tracking-[0.3em] text-gold-light">4 – 6 DEC 2026 · QSNCC BANGKOK</div>
            <div className="motion-rise mt-6 [--delay:80ms]"><Logo tone="light" className="h-28 sm:h-36" /></div>
            <h1 className="motion-rise mt-8 text-3xl leading-tight sm:text-5xl [--delay:160ms]">{L(EVENT.tagline)}</h1>
            <p className="motion-rise mt-5 max-w-xl text-lg text-white/75 [--delay:220ms]">“{L(EVENT.quote)}”</p>
            <div className="motion-rise mt-8 flex flex-wrap gap-3 [--delay:280ms]">
              <Link to="/register" className="motion-shine gold-gradient inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-on-accent">
                {tr('ลงทะเบียนเข้างานฟรี', 'Register free')} <ArrowRight size={18} />
              </Link>
              <Link to="/exhibitors" className="inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 font-semibold hover:border-white hover:bg-white/5">
                {tr('ดูผู้ออกบูธ', 'Explore exhibitors')}
              </Link>
            </div>
            <div className="motion-rise mt-10 max-w-lg [--delay:340ms]">
              <div className={`mb-2 text-xs text-white/60 ${lang === 'en' ? 'tracking-[0.2em]' : ''}`}>{tr('นับถอยหลังสู่วันงาน', 'COUNTDOWN TO OPENING')}</div>
              <GoldCountdown />
            </div>
          </div>
          {/* คีย์วิชวลลอยบนแผนที่ (ไม่มีกรอบ) พร้อมแสงทองด้านหลัง */}
          <div className="motion-pop relative mx-auto w-full max-w-xl [--delay:200ms] lg:max-w-none">
            <div className="motion-glow pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,var(--hero-glow-a),transparent)] blur-2xl" />
            <img src={keyVisual} width={1400} height={823} alt={tr('คีย์วิชวลงาน', 'Event key visual')} className="motion-float relative w-full select-none drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]" draggable={false} />
          </div>
        </div>
      </section>

      {/* ===== แถบตัวอักษรเลื่อน ===== */}
      <div className="marquee gold-gradient overflow-hidden py-3 text-on-accent" aria-hidden>
        <div className="marquee-track gap-10 pr-10 text-sm font-semibold tracking-[0.25em]">
          {[...marquee, ...marquee, ...marquee, ...marquee].map((m, i) => <span key={i} className="flex items-center gap-10">{m}<span>✦</span></span>)}
        </div>
      </div>

      {/* ===== 3 โซน: คอลัมน์เลขโรมันใหญ่ ===== */}
      <section id="zones" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GoldTitle eyebrow="THE EXPERIENCE" title={tr('3 โซนหลักของงาน', 'Three Main Zones')} />
        <Reveal group className="grid border-y border-line md:grid-cols-3 md:divide-x md:divide-line">
          {HOME_ZONES.map((z, i) => (
            <Link key={z.name} to={z.to} className="group block border-b border-line px-2 py-8 last:border-b-0 md:border-b-0 md:px-8">
              <div className="font-display text-6xl font-bold text-[var(--gold)]">0{i + 1}</div>
              <div className="mt-4 text-2xl font-bold">{z.name}</div>
              <div className="mt-1 text-sm font-semibold text-gold-text">{L(z.title)}</div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{L(z.desc)}</p>
              <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all">{tr('สำรวจโซน', 'Explore')} <ArrowUpRight size={16} /></div>
            </Link>
          ))}
        </Reveal>
      </section>

      {/* ===== ข่าว: เรื่องเด่น + รายการข่าว (สไตล์นิตยสาร) ===== */}
      <section id="news" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <GoldTitle eyebrow="NEWS & LIVE" title={tr('ข่าวประชาสัมพันธ์ & Live Streaming', 'News & Live Streaming')} />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <article>
                <div className="relative aspect-video overflow-hidden bg-navy">
                  <img src={keyVisual} alt="" className="absolute inset-0 m-auto h-[90%] w-auto object-contain" loading="lazy" />
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-surface px-3 py-1 text-xs font-semibold"><Radio size={13} className="text-red-500" /> {L(STREAMS[0].title)} · {L(STREAMS[0].when)}</span>
                </div>
                <div className="mt-5 text-xs font-semibold tracking-[0.2em] text-gold-text uppercase">{L(lead.tag)}</div>
                <h3 className="mt-2 font-display text-2xl font-bold leading-snug sm:text-3xl">{L(lead.title)}</h3>
                <p className="mt-3 text-muted">{L(lead.excerpt)}</p>
              </article>
            </Reveal>
            <div>
              <Reveal group className="divide-y divide-line border-y border-line">
                {rest.map((n) => (
                  <div key={n.date} className="flex gap-5 py-5">
                    <div className="w-14 shrink-0 text-center">
                      <div className="font-display text-3xl font-bold leading-none">{fmtDay(n.date)}</div>
                      <div className="mt-1 text-xs text-muted uppercase">{fmtMon(n.date)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gold-text">{L(n.tag)}</div>
                      <div className="mt-1 font-semibold">{L(n.title)}</div>
                      <p className="mt-1 text-sm text-muted">{L(n.excerpt)}</p>
                    </div>
                  </div>
                ))}
              </Reveal>
              <Reveal className="mt-6 bg-navy p-5 text-white">
                <div className="text-xs tracking-[0.2em] text-gold-light">LIVE STREAMING</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {STREAMS.map((s) => <li key={s.title.en} className="flex justify-between gap-3"><span>{L(s.title)}</span><span className="text-white/60">{L(s.when)}</span></li>)}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ผู้ออกบูธแนะนำ ===== */}
      <section id="exhibitors" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GoldTitle eyebrow="CURATED EXHIBITORS" title={tr('ผู้ออกบูธแนะนำ', 'Featured Exhibitors')} />
        <Reveal group className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((e) => <ExhibitorCard key={e.id} ex={e} />)}
        </Reveal>
        <div className="mt-8 text-center"><Link to="/exhibitors" className="inline-flex items-center gap-2 border-b border-fg pb-0.5 font-semibold">{tr('ดูผู้ออกบูธทั้งหมด', 'View all exhibitors')} <ArrowRight size={16} /></Link></div>
      </section>

      {/* ===== กำหนดการแบบเส้นเวลา + วิทยากร ===== */}
      <section id="programme" className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal className="mb-8">
              <div className="text-xs font-semibold tracking-[0.3em] text-gold-text">PROGRAMME · DAY 1</div>
              <h2 className="mt-2 text-3xl">{tr('กิจกรรมวันแรก', 'Day 1 Highlights')}</h2>
            </Reveal>
            <Reveal group className="relative space-y-6 border-l border-[var(--gold)] pl-8">
              {SCHEDULE.filter((s) => s.day === 1).slice(0, 5).map((s) => (
                <div key={s.id} className="relative">
                  <span className="absolute top-1.5 -left-[37px] size-2.5 rotate-45 bg-[var(--gold)]" />
                  <div className="font-display text-lg font-bold text-gold-text tabular-nums">{s.start} – {s.end}</div>
                  <div className="font-semibold">{L(s.title)}</div>
                  <div className="text-sm text-muted">{L(STAGES[s.stage])}{s.speaker ? ` · ${s.speaker}` : ''}</div>
                </div>
              ))}
            </Reveal>
            <Link to="/schedule" className="mt-8 inline-flex items-center gap-2 border-b border-fg pb-0.5 font-semibold">{tr('ดูกำหนดการทั้งหมด', 'Full schedule')} <ArrowRight size={16} /></Link>
          </div>
          <div>
            <Reveal className="mb-8">
              <div className="text-xs font-semibold tracking-[0.3em] text-gold-text">SPEAKERS</div>
              <h2 className="mt-2 text-3xl">{tr('วิทยากร & อินฟลูเอนเซอร์', 'Speakers & Influencers')}</h2>
            </Reveal>
            <Reveal group className="divide-y divide-line border-y border-line">
              {HOME_SPEAKERS.map((s) => (
                <div key={s.name} className="flex items-center gap-4 py-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold)] font-display text-lg font-bold text-gold-text">{s.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}</span>
                  <div><div className="font-semibold">{s.name}</div><div className="text-sm text-muted">{L(s.role)}</div></div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ส่วนกิจกรรม/บริการ (ใช้ร่วมกัน ปรับสีตามธีม) ===== */}
      <WorkshopSection />
      <StageSection />
      <PromoSection />
      <TravelSection />
      <ReplaysSection />
      <FaqSection />

      {/* ===== CTA ===== */}
      <section className="hero-bg relative overflow-hidden text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <div className="text-xs tracking-[0.3em] text-gold-light">{lang === 'en' ? L(EVENT.slogan).toUpperCase() : L(EVENT.slogan)}</div>
          <h2 className="mt-4 text-3xl leading-snug sm:text-4xl">“{L(EVENT.quote)}”</h2>
          <Link to="/register" className="motion-shine gold-gradient mt-8 inline-flex items-center gap-2 px-8 py-4 font-bold text-on-accent">{tr('ลงทะเบียนเข้างาน', 'Register now')} <ArrowRight size={18} /></Link>
        </div>
      </section>

      {/* ===== หน่วยงานร่วมจัด: โลโก้เรียงแถว ===== */}
      <section id="organisers" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GoldTitle eyebrow="ORGANISERS & PARTNERS" title={tr('หน่วยงานร่วมจัด', 'Organising Agencies')} />
        <Reveal group className="grid grid-cols-3 gap-px bg-line sm:grid-cols-5 lg:grid-cols-7">
          {[...Object.values(AGENCIES).map((a) => ({ k: a.short, src: AGENCY_LOGOS[a.short], alt: L(a.name) })), ...PARTNERS.map((p) => ({ k: p.en, src: PARTNER_LOGOS[p.en], alt: L(p) }))].map((x) => (
            <div key={x.k} className="flex h-24 items-center justify-center bg-white p-4" title={x.alt}>
              <img src={x.src} alt={x.alt} loading="lazy" className="max-h-full max-w-full object-contain grayscale transition hover:grayscale-0" />
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  )
}
