import { useState } from 'react'
import { Bus, CalendarDays, Car, ChevronDown, Clock, MapPin, Target, TrainFront } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT, PAVILIONS } from '../../data/event'
import { Card, PageHeader, SectionTitle } from '../../components/ui/Card'
import { LinkButton } from '../../components/ui/Button'
import type { PavilionId } from '../../data/types'

const FAQ = [
  { q: { th: 'เข้างานต้องเสียค่าใช้จ่ายหรือไม่?', en: 'Is there an admission fee?' }, a: { th: 'เข้าชมฟรีตลอด 3 วัน เพียงลงทะเบียนล่วงหน้าเพื่อรับ QR Code', en: 'Entry is free for all 3 days — just pre-register to receive your QR code.' } },
  { q: { th: 'ลืมหรือทำ QR Code หาย ทำอย่างไร?', en: 'What if I lose my QR code?' }, a: { th: 'แจ้งเจ้าหน้าที่ที่จุดลงทะเบียน ค้นหาด้วยเบอร์โทรหรืออีเมลได้ทันที', en: 'Visit the registration desk — staff can look you up by phone or email.' } },
  { q: { th: 'สมัคร Business Matching ได้อย่างไร?', en: 'How do I join Business Matching?' }, a: { th: 'SME ที่ลงทะเบียนผ่าน SME ONE ID สามารถค้นหา Buyer และขอนัดหมายผ่านระบบได้ล่วงหน้า', en: 'SMEs registered with SME ONE ID can browse buyers and request meetings in advance.' } },
  { q: { th: 'มีที่จอดรถหรือไม่?', en: 'Is parking available?' }, a: { th: 'มีที่จอดรถในอาคาร 3,000 คัน แนะนำเดินทางด้วย MRT สถานีศูนย์การประชุมแห่งชาติสิริกิติ์', en: 'Indoor parking for 3,000 cars. MRT to QSNCC station is recommended.' } },
]

export default function EventPage() {
  const { tr, L } = useI18n()
  const [openFaq, setOpenFaq] = useState(0)

  const objectives = [
    { th: 'เพิ่มช่องทางการตลาดให้ SME ไทยทั้งออนไลน์และออฟไลน์', en: 'Expand online & offline market channels for Thai SMEs' },
    { th: 'สร้างโอกาสจับคู่ธุรกิจกับ Buyer ไทยและต่างประเทศ', en: 'Create business matching with Thai and global buyers' },
    { th: 'ยกระดับทักษะผู้ประกอบการด้วยองค์ความรู้และดิจิทัล', en: 'Upskill entrepreneurs with knowledge and digital tools' },
    { th: 'วัดผลทางเศรษฐกิจ: ยอดขาย มูลค่าดีล และการคาดการณ์ 1 ปี', en: 'Measure economic impact: sales, deal value and 1-year forecast' },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageHeader eyebrow={tr('เกี่ยวกับงาน', 'About the event')} title="MOC Expo 2026" subtitle={L(EVENT.tagline)}
        actions={<LinkButton to="/register" variant="accent">{tr('ลงทะเบียน', 'Register')}</LinkButton>} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          [CalendarDays, tr('วันที่', 'Date'), L(EVENT.dateLabel)],
          [Clock, tr('เวลา', 'Hours'), EVENT.hours],
          [MapPin, tr('สถานที่', 'Venue'), L(EVENT.venue)],
        ].map(([Icon, label, value]) => {
          const I = Icon as typeof CalendarDays
          return (
            <Card key={label as string} className="flex items-start gap-3 p-5">
              <div className="rounded-xl bg-brand-soft p-2.5 text-brand"><I size={20} /></div>
              <div>
                <div className="text-xs text-muted">{label as string}</div>
                <div className="font-semibold">{value as string}</div>
              </div>
            </Card>
          )
        })}
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle title={tr('เกี่ยวกับ MOC Expo', 'About MOC Expo')} />
          <p className="leading-relaxed text-muted">
            {tr(
              'MOC Expo 2026 คือมหกรรมแสดงสินค้าและบริการของผู้ประกอบการ SME ไทย จัดโดยกระทรวงพาณิชย์ เพื่อเชื่อมโยงผู้ประกอบการกับผู้บริโภค ผู้ซื้อ และนักลงทุน ทั้งในประเทศและต่างประเทศ พร้อมระบบดิจิทัลที่ติดตามผลลัพธ์ทางเศรษฐกิจได้แบบเรียลไทม์',
              'MOC Expo 2026 is the Ministry of Commerce showcase of Thai SME products and services, connecting entrepreneurs with consumers, buyers and investors at home and abroad — backed by a digital platform that tracks economic outcomes in real time.',
            )}
          </p>
        </div>
        <div>
          <SectionTitle title={tr('วัตถุประสงค์', 'Objectives')} />
          <ul className="space-y-3">
            {objectives.map((o) => (
              <li key={o.en} className="flex gap-3">
                <Target size={20} className="mt-0.5 shrink-0 text-accent" />
                <span>{L(o)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle title="Pavilions" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(PAVILIONS) as PavilionId[]).map((id) => (
            <Card key={id} className="border-t-4 p-4" style={{ borderTopColor: PAVILIONS[id].color }}>
              <div className="font-bold">{PAVILIONS[id].name}</div>
              <div className="mt-1 text-sm text-muted">{L(PAVILIONS[id].desc)}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle title={tr('การเดินทาง', 'Getting there')} />
          <Card className="divide-y divide-line">
            {[
              [TrainFront, 'MRT', tr('สถานีศูนย์การประชุมแห่งชาติสิริกิติ์ ทางออก 3', 'QSNCC station, exit 3')],
              [Bus, tr('รถประจำทาง', 'Bus'), tr('สาย 136, 185 และรถชัตเทิลฟรีจาก BTS อโศก', 'Lines 136, 185 and a free shuttle from BTS Asok')],
              [Car, tr('รถยนต์', 'Car'), tr('ที่จอดรถในอาคาร 3,000 คัน', 'Indoor parking for 3,000 cars')],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Bus
              return (
                <div key={t as string} className="flex items-start gap-3 p-4">
                  <I size={20} className="mt-0.5 text-brand" />
                  <div><div className="font-semibold">{t as string}</div><div className="text-sm text-muted">{d as string}</div></div>
                </div>
              )
            })}
          </Card>
        </div>
        <div>
          <SectionTitle title="FAQ" />
          <div className="space-y-2">
            {FAQ.map((f, i) => (
              <Card key={i} className="overflow-hidden">
                <button className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left font-semibold" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
                  {L(f.q)}
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-4 pb-4 text-sm text-muted">{L(f.a)}</div>}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
