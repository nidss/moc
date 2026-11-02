import { Link, Navigate, useParams } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { FaqSection, NewsSection, PromoSection, ReplaysSection, StageSection, TravelSection, WorkshopSection } from './HomeExtras'
import { GROUPS_V2 } from '../../layouts/navV2'

/** หน้าเนื้อหารองที่ V2 ย้ายออกจากหน้าแรกไปไว้ในเมนูย่อย (ใช้ section เดิมของหน้าแรก V1) */
const TOPICS = {
  workshop: WorkshopSection,
  stage: StageSection,
  news: NewsSection,
  replays: ReplaysSection,
  travel: TravelSection,
  promotions: PromoSection,
  faq: FaqSection,
} as const

export default function GuidePage() {
  const { tr } = useI18n()
  const { topic = '' } = useParams()
  const Section = TOPICS[topic as keyof typeof TOPICS]
  if (!Section) return <Navigate to="/" replace />

  const group = GROUPS_V2.find((g) => g.items.some((i) => i.to === `/guide/${topic}`))!
  const current = group.items.find((i) => i.to === `/guide/${topic}`)!

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
          <Link to="/" className="hover:text-fg">{tr('หน้าแรก', 'Home')}</Link>
          <ChevronRight size={14} /> <span>{tr(group.th, group.en)}</span>
          <ChevronRight size={14} /> <span className="text-fg">{tr(current.th, current.en)}</span>
        </nav>
        {/* แท็บสลับไปหัวข้ออื่นในกลุ่มเดียวกัน */}
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {group.items.map((i) => (
            <Link key={i.to} to={i.to} aria-current={i === current ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${i === current ? 'border-brand bg-brand text-white dark:text-[#0a1120]' : 'border-line bg-surface text-fg hover:border-brand'}`}>
              {i.icon && <i.icon size={15} />} {tr(i.th, i.en)}
            </Link>
          ))}
        </div>
      </div>
      <Section />
    </div>
  )
}
