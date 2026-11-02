import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronRight, Clock, GraduationCap, MapPin, QrCode, Store, UtensilsCrossed } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT, STAGES } from '../../data/event'
import { SCHEDULE } from '../../data/schedule'
import { LinkButton } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Logo } from '../../components/Brand'
import { Reveal } from '../../components/Reveal'
import { Band, BandLink, BandTitle } from '../../components/Band'
import { useTimeLeft } from '../../components/Countdown'
import { HOME_ZONES } from './homeShared'
import { GROUPS_V2, QUICK_V2 } from '../../layouts/navV2'
import heroBg from '../../assets/brand/hero-bg.webp'
import keyVisual from '../../assets/brand/key-visual.webp'

const ZONE_ICON = [Store, GraduationCap, UtensilsCrossed]
/** ไฮไลต์ที่คนมาครั้งแรกน่าสนใจ: พิธีเปิด, Talk แรก, Live Commerce */
const HIGHLIGHT_IDS = ['s1', 's2', 's14']

/** นับถอยหลังแบบบรรทัดเดียว (เล็กกว่าตัวนับของ V1) */
function CompactCountdown() {
  const { tr } = useI18n()
  const t = useTimeLeft(EVENT.startsAt, EVENT.endsAt)
  if (t.state !== 'before') {
    return <span className="gold-text-gradient font-bold">{t.state === 'live' ? tr('งานกำลังจัดอยู่ตอนนี้', 'The event is on now') : tr('จบงานแล้ว ขอบคุณที่ร่วมงาน', 'The event has ended. Thank you!')}</span>
  }
  const parts: [number, string][] = [[t.d, tr('วัน', 'd')], [t.h, tr('ชม.', 'h')], [t.m, tr('นาที', 'm')], [t.s, tr('วิ', 's')]]
  return (
    <span className="flex items-baseline gap-2.5 tabular-nums" role="timer" aria-label={tr(`อีก ${t.d} วัน ${t.h} ชั่วโมง`, `${t.d} days ${t.h} hours to go`)}>
      {parts.map(([n, label], i) => (
        <span key={i} className="flex items-baseline gap-1" aria-hidden>
          <span className="gold-text-gradient text-2xl font-extrabold sm:text-3xl">{i === 0 ? n : t.pad(n)}</span>
          <span className="text-xs text-white/70">{label}</span>
        </span>
      ))}
    </span>
  )
}

/**
 * หน้าแรก V2: กระชับสำหรับคนเข้ามาครั้งแรก
 * เหลือแค่ ข้อมูลงาน + ลงทะเบียน → ทางลัด 4 อย่าง → 3 โซน → ไฮไลต์ → ลิงก์ช่วยเหลือ
 * เนื้อหารอง (Workshop, เวทีกลาง, คูปอง, การเดินทาง, FAQ, ข่าว, คลิป) ย้ายไปอยู่ในเมนูย่อยของ header
 */
export default function HomeV2() {
  const { tr, L } = useI18n()
  const highlights = HIGHLIGHT_IDS.map((id) => SCHEDULE.find((s) => s.id === id)!).filter(Boolean)
  const helpLinks = GROUPS_V2.flatMap((g) => g.items).filter((i) => ['/guide/faq', '/guide/promotions', '/guide/workshop', '/ai'].includes(i.to))

  return (
    <div>
      {/* Hero แบบกระชับ: ข้อความสั้น ปุ่มหลักปุ่มเดียว และนับถอยหลังบรรทัดเดียว */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="hero-photo pointer-events-none absolute inset-0 bg-cover bg-right-bottom" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--hero-1)]/80 via-[var(--hero-1)]/60 to-[var(--hero-1)]/45 lg:bg-gradient-to-r lg:from-[var(--hero-1)]/70 lg:via-[var(--hero-1)]/25 lg:to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pt-8 pb-16 sm:px-6 sm:pt-10 lg:grid-cols-[1.1fr_1fr] lg:pb-20">
          <div>
            <div className="motion-rise"><Logo tone="light" className="h-24 sm:h-32" /></div>
            <h1 className="motion-rise mt-5 max-w-xl text-xl font-semibold leading-snug [--delay:100ms] sm:text-2xl">{L(EVENT.tagline)}</h1>
            <div className="motion-rise mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-white/85 [--delay:180ms]">
              <span className="flex items-center gap-1.5"><CalendarDays size={16} className="text-gold-light" /> {L(EVENT.dateLabel)}</span>
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-gold-light" /> {EVENT.hours}</span>
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gold-light" /> QSNCC Hall 7–8</span>
            </div>
            <div className="motion-rise mt-6 flex flex-wrap items-center gap-3 [--delay:260ms]">
              <LinkButton to="/register" variant="accent" size="lg" className="motion-shine" icon={<QrCode size={20} />}>{tr('ลงทะเบียนเข้างานฟรี', 'Register free')}</LinkButton>
              <Link to="/exhibitors" className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-white/85 hover:text-white">
                {tr('ดูผู้ออกบูธ', 'Explore exhibitors')} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="motion-rise mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-[var(--hero-1)]/55 px-4 py-3 ring-1 ring-white/15 backdrop-blur-md [--delay:340ms]">
              <span className="text-sm text-white/80">{tr('อีกไม่นานเปิดงาน', 'Opens in')}</span>
              <CompactCountdown />
            </div>
          </div>
          {/* คีย์วิชวล: ซ่อนบนมือถือเพื่อให้เห็นปุ่มลงทะเบียนทันที */}
          <div className="motion-pop relative hidden [--delay:200ms] lg:block">
            <div className="motion-glow pointer-events-none absolute inset-[14%] rounded-full bg-[radial-gradient(closest-side,rgba(232,189,92,0.4),rgba(40,110,220,0.2),transparent)] blur-2xl" />
            <img src={keyVisual} width={1400} height={823} decoding="async" alt="" draggable={false}
              className="motion-float relative w-full select-none drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]" />
          </div>
        </div>
      </section>

      {/* ทางลัด 4 อย่าง วางทับขอบล่างของ hero */}
      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <Reveal group className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_V2.map((q, i) => (
            <Link key={q.to} to={q.to} className="group">
              <Card className={`flex h-full items-center gap-3 p-4 shadow-lg transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl ${i === 0 ? 'ring-2 ring-[var(--gold)]' : ''}`}>
                {q.icon && <span className={`shrink-0 rounded-xl p-2.5 ${i === 0 ? 'gold-gradient text-navy' : 'bg-brand-soft text-brand'}`}><q.icon size={20} /></span>}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-snug sm:text-base">{tr(q.th, q.en)}</span>
                  <span className="block truncate text-xs text-muted">{tr(q.dth ?? '', q.den ?? '')}</span>
                </span>
                <ChevronRight size={18} className="hidden shrink-0 text-muted transition-transform group-hover:translate-x-0.5 sm:block" />
              </Card>
            </Link>
          ))}
        </Reveal>
      </div>

      {/* 3 โซนหลัก แบบย่อ */}
      <Band id="zones">
        <BandTitle title={tr('ในงานมีอะไรบ้าง', "What's inside")} subtitle={tr('3 โซนหลัก เดินชมได้ในวันเดียว', 'Three main zones, easy to see in a day')}
          action={<BandLink to="/floorplan">{tr('ดูผังงาน', 'Floor plan')}</BandLink>} />
        <Reveal group className="grid gap-3 md:grid-cols-3">
          {HOME_ZONES.map((z, i) => {
            const Icon = ZONE_ICON[i]
            return (
              <Link key={z.name} to={z.to} className="group">
                <Card className="flex h-full items-start gap-4 p-5 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <span className="gold-gradient shrink-0 rounded-xl p-2.5 text-navy"><Icon size={22} /></span>
                  <span className="min-w-0">
                    <span className="block font-bold tracking-tight">{z.name}</span>
                    <span className="block text-sm text-muted">{L(z.title)}</span>
                  </span>
                </Card>
              </Link>
            )
          })}
        </Reveal>
      </Band>

      {/* ไฮไลต์ไม่ควรพลาด */}
      <Band tone="white" id="highlights">
        <BandTitle title={tr('ไฮไลต์ไม่ควรพลาด', "Don't miss")}
          action={<BandLink to="/schedule">{tr('กำหนดการทั้งหมด', 'Full schedule')}</BandLink>} />
        <Reveal group className="grid gap-3 md:grid-cols-3">
          {highlights.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-gold-text">
                <CalendarDays size={14} /> {tr(`${s.day + 3} ธ.ค.`, `${s.day + 3} Dec`)} · {s.start} – {s.end}
              </div>
              <div className="mt-2 font-bold leading-snug">{L(s.title)}</div>
              <div className="mt-1 text-sm text-muted">{L(STAGES[s.stage])}{s.speaker ? ` · ${s.speaker}` : ''}</div>
            </Card>
          ))}
        </Reveal>
      </Band>

      {/* ลิงก์ช่วยเหลือ: ชี้ไปเนื้อหาที่อยู่ในเมนูย่อย */}
      <Band tone="tint">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">{tr('อยากรู้อะไรเพิ่ม?', 'Want to know more?')}</h2>
            <p className="text-sm text-muted">{tr('ข้อมูลอื่น ๆ อยู่ในเมนูด้านบน', 'Everything else is in the menu above')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {helpLinks.map((h) => (
              <Link key={h.to} to={h.to} className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand">
                {h.icon && <h.icon size={16} className="text-brand" />} {tr(h.th, h.en)}
              </Link>
            ))}
          </div>
        </Reveal>
      </Band>
    </div>
  )
}
