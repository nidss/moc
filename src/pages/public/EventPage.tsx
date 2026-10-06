import { useState } from 'react'
import { Bus, CalendarDays, Car, ChevronDown, Clock, MapPin, Target, TrainFront } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { EVENT } from '../../data/event'
import { Card, PageHeader, SectionTitle } from '../../components/ui/Card'
import { LinkButton } from '../../components/ui/Button'

const FAQ = [
  { q: { th: 'เข้างานต้องเสียค่าใช้จ่ายหรือไม่?', en: 'Is there an admission fee?' }, a: { th: 'เข้าชมฟรีตลอด 3 วัน เพียงลงทะเบียนล่วงหน้าเพื่อรับ QR Code', en: 'Entry is free for all 3 days — just pre-register to receive your QR code.' } },
  { q: { th: 'ลืมหรือทำ QR Code หาย ทำอย่างไร?', en: 'What if I lose my QR code?' }, a: { th: 'แจ้งเจ้าหน้าที่ที่จุดลงทะเบียน ค้นหาด้วยเบอร์โทรหรืออีเมลได้ทันที', en: 'Visit the registration desk — staff can look you up by phone or email.' } },
  { q: { th: 'สมัคร Business Matching ได้อย่างไร?', en: 'How do I join Business Matching?' }, a: { th: 'SME ที่ลงทะเบียนผ่าน SME ONE ID สามารถค้นหา Buyer และขอนัดหมายผ่านระบบได้ล่วงหน้า', en: 'SMEs registered with SME ONE ID can browse buyers and request meetings in advance.' } },
  { q: { th: 'มีที่จอดรถหรือไม่?', en: 'Is parking available?' }, a: { th: 'มีที่จอดรถในอาคาร 3,000 คัน แนะนำเดินทางด้วย MRT สถานีศูนย์การประชุมแห่งชาติสิริกิติ์', en: 'Indoor parking for 3,000 cars. MRT to QSNCC station is recommended.' } },
]

export default function EventPage() {
  const { tr, L } = useI18n()
  const [openFaq, setOpenFaq] = useState(0)

  // วัตถุประสงค์ตามเอกสารโครงการ
  const objectives = [
    { th: 'สร้างรายได้และขยายโอกาสทางการค้าให้แก่ผู้ประกอบการ SME', en: 'Generate income and expand trade opportunities for SMEs' },
    { th: 'ยกระดับศักยภาพผู้ประกอบการ SME ให้มีองค์ความรู้และมุมมองในการดำเนินธุรกิจในมิติต่าง ๆ', en: 'Strengthen SME capabilities with knowledge and new business perspectives' },
    { th: 'ผู้ประกอบการ SME สามารถเชื่อมโยงและขยายความร่วมมือทางธุรกิจกับพันธมิตรและคู่ค้ารายใหม่ทั้งในและต่างประเทศ ผ่านการเจรจาธุรกิจ อันนำไปสู่การเป็นส่วนหนึ่งของห่วงโซ่คุณค่าโลก (Global Value Chain)', en: 'Connect SMEs with new partners at home and abroad through business matching, joining the Global Value Chain' },
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
              'MOC Expo 2026 โครงการเชื่อมโยงการค้าและเจรจาธุรกิจผู้ประกอบการไทย โดยกระทรวงพาณิชย์ ร่วมกับกรมพัฒนาธุรกิจการค้า และ สสว. รวมผู้ประกอบการกว่า 200 ราย จาก 9 หน่วยงานในสังกัดกระทรวงพาณิชย์ และพันธมิตร 5 หน่วยงาน ตั้งเป้าผู้เข้าร่วมงาน 8,000 ราย และสร้างมูลค่าทางเศรษฐกิจ 100 ล้านบาท',
              'MOC Expo 2026 is the Ministry of Commerce trade linkage and business matching programme for Thai entrepreneurs, with DBD and OSMEP. It brings together 200+ SMEs from 9 MOC agencies and 5 partners, targeting 8,000 participants and THB 100 million in economic value.',
            )}
          </p>
        </div>
        <div>
          <SectionTitle title={tr('วัตถุประสงค์', 'Objectives')} />
          <ul className="space-y-3">
            {objectives.map((o) => (
              <li key={o.en} className="flex gap-3">
                <Target size={20} className="mt-0.5 shrink-0 text-gold" />
                <span>{L(o)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <SectionTitle title={tr('กิจกรรมโครงการ', 'Programme')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Zone 1 · MOC HUB', tr('Pavilion สินค้าและบริการให้คำปรึกษา จาก 9 หน่วยงาน ผู้ประกอบการ 200 ราย และ 14 หน่วยงานให้คำปรึกษา', 'Products & advisory pavilion: 200 SMEs from 9 agencies plus 14 advisory agencies')],
            ['Zone 2 · MOC UP SKILL', tr('เวทีเสริมทักษะ องค์ความรู้ และสาระบันเทิงในการทำธุรกิจ', 'Stage for business skills, knowledge and edutainment')],
            ['Zone 3 · MOC TASTE', tr('ช้อปชิมอาหารเด็ด 100 บูธ จากร้านดังและร้านรางวัล', '100 booths of famous and award-winning food')],
            ['Business Matching Lounge', tr('เจรจาธุรกิจระหว่างผู้ประกอบการกับหน่วยงานพันธมิตร', 'Business negotiation with partner organisations')],
            ['Workshop', tr('ทำผลิตภัณฑ์สมุนไพรไทย เพ้นท์/พับดอกไม้ ทำเครื่องดื่มสมุนไพร', 'Thai herbal products, flower painting/folding, herbal drinks')],
            ['Private Pavilion', tr('Modern Trade เทคโนโลยี สถาบันการเงิน สื่อสาร และตรวจสุขภาพ', 'Modern trade, technology, finance, telecom and health checks')],
          ].map(([t, d]) => (
            <Card key={t} className="border-t-4 border-t-gold p-4">
              <div className="font-bold">{t}</div>
              <div className="mt-1 text-sm text-muted">{d}</div>
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
