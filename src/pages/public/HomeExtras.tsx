import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Accessibility, Baby, BatteryCharging, Bus, Car, CarTaxiFront, Check, ChevronDown, CirclePlay, Clock, Copy, ExternalLink, Gift,
  HeartPulse, Landmark, MapPinned, Mic2, Newspaper, Package, Radio, Smartphone, Sparkles, Ticket, TrainFront, Users, Wifi, type LucideIcon,
} from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT } from '../../data/event'
import {
  CENTER_STAGE, CLIPS, COUPONS, COUPON_TERMS, FACILITIES, FAQS, LIVE_COMMERCE, LIVE_PLATFORMS, MAP_URL, NEWS, STAGE_KINDS, STREAMS,
  STREAM_CHANNELS, TRAVEL, WORKSHOPS, type Facility, type StageKind, type TravelMode,
} from '../../data/homeContent'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LinkButton } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Reveal } from '../../components/Reveal'
import { Band, BandLink, BandTitle, type BandTone } from '../../components/Band'
import { FloorPlanMap } from '../../components/FloorPlanMap'
import { FloorPlanMapV1 } from '../../components/FloorPlanMapV1'
import { FloorPlanVersionToggle, floorPlanHref, type MapVersion } from '../../components/FloorPlanVersionToggle'
import keyVisual from '../../assets/brand/key-visual.webp'

const TRAVEL_ICON: Record<TravelMode, LucideIcon> = { mrt: TrainFront, bus: Bus, car: Car, taxi: CarTaxiFront }
const FACILITY_ICON: Record<Facility, LucideIcon> = {
  wifi: Wifi, wheelchair: Accessibility, nursing: Baby, firstaid: HeartPulse, locker: Package, charging: BatteryCharging, atm: Landmark, prayer: Sparkles,
}
const KIND_STYLE: Record<StageKind, string> = {
  entertain: 'bg-[#ede9fe] text-[#6d28d9] dark:bg-[#2e1f55] dark:text-[#c4b5fd]',
  heal: 'bg-success-soft text-success',
  joy: 'bg-accent-soft text-gold-text',
}
const COUPON_KEY = 'moc-demo-coupons'

function readCoupons(): string[] {
  try { return JSON.parse(localStorage.getItem(COUPON_KEY) ?? '[]') } catch { return [] }
}

/** วันที่แบบย่อตามภาษา เช่น 1 พ.ย. 2569 / 1 Nov 2026 */
function fmtDateFor(lang: string, iso: string) {
  return new Date(iso).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** section เต็มความกว้าง พร้อม anchor และหัวข้อ (สีตัวอักษรปรับตามพื้นหลัง) */
function Block({ id, tone = 'plain', eyebrow, title, subtitle, action, children }: {
  id: string; tone?: BandTone; eyebrow?: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode; children: ReactNode
}) {
  return (
    <Band id={id} tone={tone}>
      <BandTitle eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} dark={tone === 'navy'} />
      {children}
    </Band>
  )
}

/** ผังงานบนหน้าแรก สลับ V1 (2.5D เดิม) / V2 (ผังตามแบบจริง) ได้ คลิกโซนเพื่อเปิดผังเต็มที่โซนนั้น */
export function FloorPlanSection({ tone = 'white' }: { tone?: BandTone }) {
  const { tr, L } = useI18n()
  const navigate = useNavigate()
  const [map, setMap] = useState<MapVersion>('v2')
  const open = (zone: string) => navigate(floorPlanHref(map, zone))
  return (
    <Block id="floorplan" tone={tone} eyebrow="FLOOR PLAN" title={tr('ผังงาน', 'Floor Plan')} subtitle={L(EVENT.venue)}
      action={<BandLink to={floorPlanHref(map)} dark={tone === 'navy'}>{tr('เปิดผังแบบเต็ม', 'Open full map')}</BandLink>}>
      <Reveal>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <FloorPlanVersionToggle value={map} onChange={setMap} />
          <span className={`text-xs ${tone === 'navy' ? 'text-white/70' : 'text-muted'}`}>{tr('คลิกโซนเพื่อดูรายละเอียด', 'Click a zone for details')}</span>
        </div>
        {map === 'v2' ? <FloorPlanMap compact onSelect={open} /> : <FloorPlanMapV1 compact onSelect={open} />}
      </Reveal>
    </Block>
  )
}

/** ส่วนต่อขยายของหน้าแรก (ธีมคลาสสิก): กิจกรรม โปรโมชั่น การเดินทาง คลิป และ FAQ */
export function HomeExtras() {
  return (
    <>
      <WorkshopSection />
      <StageSection />
      <PromoSection />
      <TravelSection />
      <ReplaysSection />
      <FaqSection />
    </>
  )
}

/** Workshop & Live Commerce */
export function WorkshopSection() {
  const { tr, L } = useI18n()
  const dayLabel = (d: number) => (d === 0 ? tr('ทุกวัน', 'Daily') : tr(`${d + 3} ธ.ค.`, `${d + 3} Dec`))
  return (
    <Block id="workshop" tone="warm" eyebrow="WORKSHOP & LIVE" title={tr('Workshop & Live Commerce', 'Workshops & Live Commerce')}
      subtitle={tr('ลงมือทำจริง ได้ของกลับบ้าน และช้อปผ่านไลฟ์จากบูธในงาน', 'Hands-on sessions to take home, plus live shopping from the booths')}
      action={<Link to="/schedule" className="text-sm font-semibold text-brand hover:underline">{tr('ดูกำหนดการทั้งหมด', 'Full schedule')} →</Link>}>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Reveal group className="grid gap-3 sm:grid-cols-2">
          {WORKSHOPS.map((w) => (
            <Card key={w.day + w.start} className="flex flex-col p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="brand">{dayLabel(w.day)} · {w.start}–{w.end}</Badge>
                <span className="flex items-center gap-1 text-xs text-muted"><Users size={13} /> {w.seats} {tr('ที่นั่ง', 'seats')}</span>
              </div>
              <div className="mt-3 font-bold">{L(w.title)}</div>
              <p className="mt-1 text-sm text-muted">{L(w.desc)}</p>
              <div className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold text-gold-text"><Gift size={14} /> {L(w.takeHome)}</div>
            </Card>
          ))}
        </Reveal>
        <Reveal>
          <div className="hero-bg relative h-full overflow-hidden rounded-2xl p-5 text-white">
            <div className="hero-net pointer-events-none absolute inset-0" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold"><span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE</span>
                <span className="text-lg font-bold">Live Commerce</span>
              </div>
              <p className="mt-2 text-sm text-white/75">{tr('ผู้ประกอบการไลฟ์ขายจากบูธจริง สั่งซื้อได้ทันทีพร้อมโค้ดส่วนลดเฉพาะไลฟ์', 'SMEs sell live from their booths; order instantly with live-only codes')}</p>
              <ul className="mt-4 space-y-2.5">
                {LIVE_COMMERCE.map((s) => (
                  <li key={L(s.title)} className={`rounded-xl p-3 ring-1 ${s.highlight ? 'bg-white/15 ring-gold/60' : 'bg-white/[0.06] ring-white/15'}`}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gold-light"><Clock size={13} /> {L(s.when)}</div>
                    <div className="mt-0.5 text-sm font-semibold">{L(s.title)}</div>
                    <div className="text-xs text-white/60">{L(s.host)}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {LIVE_PLATFORMS.map((p) => <span key={p} className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs ring-1 ring-white/20"><Smartphone size={12} /> {p}</span>)}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Block>
  )
}

/** กิจกรรมเวทีกลาง (กรองตามวัน) */
export function StageSection() {
  const { tr, L } = useI18n()
  const dayLabel = (d: number) => (d === 0 ? tr('ทุกวัน', 'Daily') : tr(`${d + 3} ธ.ค.`, `${d + 3} Dec`))
  const [stageDay, setStageDay] = useState<0 | 1 | 2 | 3>(0)
  const acts = CENTER_STAGE.filter((a) => stageDay === 0 || a.day === stageDay || a.day === 0)
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  return (
    <Block id="stage" tone="navy" eyebrow="CENTER STAGE" title={tr('กิจกรรมเวทีกลาง', 'Center Stage')}
      subtitle={tr('บันเทิง ฮีลใจ และมอบความสุข ตลอด 3 วัน', 'Entertainment, healing and happiness all 3 days')}
      action={
        <div className="flex rounded-full border border-line bg-surface p-1 text-sm" role="tablist">
          {([0, 1, 2, 3] as const).map((d) => (
            <button key={d} role="tab" aria-selected={stageDay === d} onClick={() => setStageDay(d)}
              className={`rounded-full px-3 py-1 font-semibold transition-colors ${stageDay === d ? 'bg-brand text-white dark:text-[#0a1120]' : 'text-muted hover:text-fg'}`}>
              {d === 0 ? tr('ทั้งหมด', 'All') : dayLabel(d)}
            </button>
          ))}
        </div>
      }>
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(STAGE_KINDS) as StageKind[]).map((k) => (
          <span key={k} className={`rounded-full px-3 py-1 text-xs font-semibold ${KIND_STYLE[k]}`}>{L(STAGE_KINDS[k])}</span>
        ))}
      </div>
      <Reveal group key={stageDay} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {acts.map((a) => (
          <Card key={a.day + a.time + L(a.title)} className="group flex flex-col p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${KIND_STYLE[a.kind]}`}>{L(STAGE_KINDS[a.kind])}</span>
              <span className="text-xs font-semibold tabular-nums text-muted">{dayLabel(a.day)} · {a.time}</span>
            </div>
            <div className="mt-3 flex items-start gap-2 font-bold"><Mic2 size={16} className="mt-1 shrink-0 text-brand transition-transform group-hover:scale-110" /> {L(a.title)}</div>
            <p className="mt-1 text-sm text-muted">{L(a.desc)}</p>
          </Card>
        ))}
      </Reveal>
    </Block>
  )
}

/** โปรโมชั่น & คูปอง (เก็บคูปองแล้วได้โค้ด) */
export function PromoSection() {
  const { tr, L } = useI18n()
  const [claimed, setClaimed] = useState<string[]>(readCoupons)
  const claim = (id: string) => setClaimed((c) => {
    const next = c.includes(id) ? c : [...c, id]
    try { localStorage.setItem(COUPON_KEY, JSON.stringify(next)) } catch { /* เบราว์เซอร์ปิด storage: ใช้เฉพาะในหน้านี้ */ }
    return next
  })
  const [copied, setCopied] = useState('')
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {})
    setCopied(code); window.setTimeout(() => setCopied(''), 1500)
  }
  return (
    <Block id="promotions" tone="plain" eyebrow="PROMOTIONS" title={tr('โปรโมชั่น & คูปองส่วนลด', 'Promotions & Coupons')}
      subtitle={tr('เก็บคูปองไว้ก่อน แล้วแสดงพร้อม QR Ticket ที่ร้านค้าในงาน', 'Collect now and show with your QR ticket at the shops')}>
      <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COUPONS.map((c) => {
          const got = claimed.includes(c.id)
          return (
            <div key={c.id} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <div className="gold-gradient relative px-5 py-4 text-on-accent">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide"><Ticket size={14} /> {tr('คูปอง', 'Coupon')}</div>
                <div className="mt-1 text-3xl font-extrabold">{c.value}</div>
                <div className="text-sm font-semibold">{L(c.title)}</div>
              </div>
              {/* รอยปรุแบบตั๋ว */}
              <div className="relative border-t-2 border-dashed border-line">
                <span className="absolute -top-2.5 -left-2.5 size-5 rounded-full bg-bg" />
                <span className="absolute -top-2.5 -right-2.5 size-5 rounded-full bg-bg" />
              </div>
              <div className="flex flex-1 flex-col gap-1 px-5 pt-4 pb-5 text-sm">
                <div className="text-muted">{L(c.where)}</div>
                {c.minSpend && <div className="font-semibold">{L(c.minSpend)}</div>}
                <div className="text-xs text-muted">{tr('จำนวน', 'Quota')}: {L(c.quota)}</div>
                <div className="mt-auto pt-3">
                  {got ? (
                    <button onClick={() => copy(c.code)} className="flex w-full items-center justify-between rounded-xl border border-dashed border-brand/50 bg-brand-soft px-3 py-2 font-mono text-sm font-bold text-brand">
                      {c.code} {copied === c.code ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  ) : (
                    <button onClick={() => claim(c.id)} className="w-full rounded-xl bg-brand px-3 py-2 font-semibold text-white transition hover:bg-brand-strong dark:text-[#0a1120]">
                      {tr('เก็บคูปอง', 'Collect')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </Reveal>
      <Reveal>
        <details className="group mt-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
            {tr('เงื่อนไขการรับสิทธิ์', 'Terms & conditions')}
            <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" />
          </summary>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
            {COUPON_TERMS.map((t) => <li key={t.en}>{L(t)}</li>)}
          </ol>
        </details>
      </Reveal>
    </Block>
  )
}

/** การเดินทาง & สิ่งอำนวยความสะดวก */
export function TravelSection() {
  const { tr, L } = useI18n()
  return (
    <Block id="travel" tone="white" eyebrow="GETTING THERE" title={tr('การเดินทาง & สิ่งอำนวยความสะดวก', 'Getting There & Facilities')} subtitle={L(EVENT.venue)}
      action={<a href={MAP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-brand hover:underline"><MapPinned size={15} /> {tr('เปิดแผนที่', 'Open map')}</a>}>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Reveal group className="grid gap-3 sm:grid-cols-2">
          {TRAVEL.map((t) => {
            const Icon = TRAVEL_ICON[t.mode]
            return (
              <Card key={t.mode} className="group flex gap-3 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className="h-fit rounded-xl bg-brand-soft p-2.5 text-brand transition-transform group-hover:scale-110"><Icon size={20} /></div>
                <div>
                  <div className="font-semibold">{L(t.title)}</div>
                  <p className="mt-0.5 text-sm text-muted">{L(t.detail)}</p>
                </div>
              </Card>
            )
          })}
        </Reveal>
        <Reveal>
          <Card className="h-full p-5">
            <div className="font-semibold">{tr('สิ่งอำนวยความสะดวกในงาน', 'On-site facilities')}</div>
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3.5">
              {FACILITIES.map((f) => {
                const Icon = FACILITY_ICON[f.id]
                return <div key={f.id} className="flex items-center gap-2.5 text-sm"><Icon size={18} className="shrink-0 text-gold-text" /> {L(f.label)}</div>
              })}
            </div>
            <div className="mt-5 rounded-xl bg-surface-2 p-3 text-xs text-muted">{tr(`เปิดให้เข้างาน ${L(EVENT.dateLabel)} เวลา ${EVENT.hours} น. · ประตูทางเข้าหลัก Hall 7`, `Open ${L(EVENT.dateLabel)}, ${EVENT.hours} · Main entrance at Hall 7`)}</div>
          </Card>
        </Reveal>
      </div>
    </Block>
  )
}

/** คลิปย้อนหลัง (เปิดตัวเล่นเดโม) */
export function ReplaysSection() {
  const { tr, L, lang } = useI18n()
  const fmtDate = (iso: string) => fmtDateFor(lang, iso)
  const [clip, setClip] = useState<(typeof CLIPS)[number] | null>(null)
  const thumb = (id: string) => `${import.meta.env.BASE_URL}images/exhibitors/${id}/banner.webp`
  return (
    <Block id="replays" tone="navy" eyebrow="REPLAYS" title={tr('คลิปย้อนหลัง', 'Replays')} subtitle={tr('ไฮไลต์ เบื้องหลัง และคลิปจากเวทีต่าง ๆ', 'Highlights, behind the scenes and stage recordings')}>
      <Reveal group className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLIPS.map((c) => (
          <button key={c.thumb} onClick={() => setClip(c)} className="group overflow-hidden rounded-2xl border border-line bg-surface text-left text-fg transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative aspect-video overflow-hidden">
              <img src={thumb(c.thumb)} alt="" loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
              <CirclePlay size={52} strokeWidth={1.5} className="absolute inset-0 m-auto text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white tabular-nums">{c.duration}</span>
            </div>
            <div className="p-4">
              <div className="line-clamp-2 font-semibold">{L(c.title)}</div>
              <div className="mt-1 text-xs text-muted">{fmtDate(c.date)}</div>
            </div>
          </button>
        ))}
      </Reveal>
      <Modal open={!!clip} onClose={() => setClip(null)} title={clip ? L(clip.title) : ''} wide>
        {clip && (
          <div>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              <img src={thumb(clip.thumb)} alt="" className="size-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-white">
                <CirclePlay size={64} strokeWidth={1.25} />
                <div className="text-sm text-white/80">{tr('ตัวอย่างสำหรับเดโม ระบบจริงจะเล่นคลิปจาก YouTube / Facebook ของงาน', 'Demo placeholder: the live site plays the event’s YouTube / Facebook video')}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted">{fmtDate(clip.date)} · {clip.duration}</div>
          </div>
        )}
      </Modal>
    </Block>
  )
}

/** คำถามที่พบบ่อย */
export function FaqSection() {
  const { tr, L } = useI18n()
  return (
    <Block id="faq" tone="tint" eyebrow="FAQ" title={tr('คำถามที่พบบ่อย', 'FAQ')}>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Reveal group className="space-y-2.5">
          {FAQS.map((f) => (
            <details key={f.q.en} className="group rounded-2xl border border-line bg-surface px-5 py-4 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold">
                {L(f.q)}
                <ChevronDown size={18} className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{L(f.a)}</p>
            </details>
          ))}
        </Reveal>
        <Reveal>
          <Card className="p-5">
            <div className="font-semibold">{tr('ยังไม่พบคำตอบ?', 'Still have questions?')}</div>
            <p className="mt-1 text-sm text-muted">{tr('ถาม MOC AI ได้ตลอด 24 ชม. หรือติดต่อจุดประชาสัมพันธ์ในงาน', 'Ask MOC AI any time, or visit the info desk at the event.')}</p>
            <div className="mt-4 flex flex-col gap-2">
              <LinkButton to="/ai" size="sm">{tr('ถาม MOC AI', 'Ask MOC AI')}</LinkButton>
              <a href={MAP_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-2">
                {tr('แผนที่ไปงาน', 'Directions')} <ExternalLink size={14} />
              </a>
            </div>
          </Card>
        </Reveal>
      </div>
    </Block>
  )
}

/** ข่าวประชาสัมพันธ์ & Live Streaming (วางไว้ใต้ 3 โซนหลักของงาน) */
export function NewsSection() {
  const { tr, L, lang } = useI18n()
  const fmtDate = (iso: string) => fmtDateFor(lang, iso)
  return (
    <>
        {/* 5) ข่าว + Live Streaming */}
        <Block id="news" tone="white" eyebrow="NEWS & LIVE" title={tr('ข่าวประชาสัมพันธ์ & Live Streaming', 'News & Live Streaming')}>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
              <div className="overflow-hidden rounded-2xl bg-navy text-white ring-1 ring-black/5">
                <div className="relative aspect-video bg-[var(--hero-1)]">
                  <img src={keyVisual} alt="" className="absolute inset-0 m-auto h-[85%] w-auto object-contain opacity-60" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-1)] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur"><Radio size={13} className="text-red-400" /> {tr('ถ่ายทอดสดเร็ว ๆ นี้', 'Live soon')}</span>
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-xs text-gold-light">{tr('ถ่ายทอดสดครั้งถัดไป', 'Next live stream')}</div>
                    <div className="text-lg font-bold">{L(STREAMS[0].title)} · {L(STREAMS[0].when)}</div>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  {STREAMS.slice(1).map((s) => (
                    <div key={s.title.en} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2"><CirclePlay size={16} className="text-gold-light" /> {L(s.title)}</span>
                      <span className="shrink-0 text-white/60">{L(s.when)}</span>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {STREAM_CHANNELS.map((c) => <span key={c} className="rounded-full bg-white/10 px-2.5 py-1 text-xs ring-1 ring-white/20">{c}</span>)}
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal group className="grid gap-3">
              {NEWS.map((n) => (
                <Card key={n.date} className="group flex gap-4 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="hidden h-fit rounded-xl bg-brand-soft p-2.5 text-brand sm:block"><Newspaper size={20} /></div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge tone="accent">{L(n.tag)}</Badge>
                      <span className="text-muted">{fmtDate(n.date)}</span>
                    </div>
                    <div className="mt-1.5 font-semibold group-hover:text-brand">{L(n.title)}</div>
                    <p className="mt-0.5 text-sm text-muted">{L(n.excerpt)}</p>
                  </div>
                </Card>
              ))}
            </Reveal>
          </div>
        </Block>
    </>
  )
}
