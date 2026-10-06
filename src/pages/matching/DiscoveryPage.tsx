import { useMemo, useState } from 'react'
import { Globe2, Search, Sparkles, Wallet } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYERS } from '../../data/buyers'
import { CATEGORIES } from '../../data/event'
import { EXHIBITOR_BY_ID, DEMO_SME_ID } from '../../data/exhibitors'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { LinkButton } from '../../components/ui/Button'
import { Chip, Input } from '../../components/ui/Form'
import { OrgAvatar } from '../../components/Brand'
import type { CategoryId } from '../../data/types'

export default function DiscoveryPage() {
  const { tr, L } = useI18n()
  const me = EXHIBITOR_BY_ID[DEMO_SME_ID]
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<CategoryId | ''>('')

  const buyers = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return BUYERS.map((b) => {
      // คะแนนความเหมาะสมแบบง่าย: หมวดตรงกัน + ความสนใจสินค้าส่งออก
      const score = (b.interests.includes(me.category) ? 70 : 35) + (b.interests.length <= 3 ? 15 : 8) + (me.tags.includes('export-ready') && b.country.en !== 'Thailand' ? 12 : 0)
      return { b, score: Math.min(98, score) }
    })
      .filter(({ b }) => !cat || b.interests.includes(cat))
      .filter(({ b }) => !needle || [b.name, b.type.th, b.type.en, b.lookingFor.th, b.lookingFor.en, b.country.th, b.country.en].some((s) => s.toLowerCase().includes(needle)))
      .sort((a, b) => b.score - a.score)
  }, [q, cat, me])

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ค้นหา Buyer, ประเทศ, สินค้าที่ต้องการ...', 'Search buyers, countries, needs...')} className="pl-10" aria-label="Search buyers" />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <Chip active={!cat} onClick={() => setCat('')} className="shrink-0">{tr('ทั้งหมด', 'All')}</Chip>
          {(['food', 'health', 'home', 'fashion', 'agri', 'service'] as CategoryId[]).map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)} className="shrink-0">{L(CATEGORIES[c])}</Chip>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Sparkles size={16} className="text-accent" />
        {tr(`เรียงตามความเหมาะสมกับ ${me.name.th}`, `Sorted by fit with ${me.name.en}`)}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {buyers.map(({ b, score }) => (
          <Card key={b.id} className="flex flex-col p-5">
            <div className="flex items-start gap-4">
              <OrgAvatar org={b} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-lg font-bold">{b.name}</div>
                    <div className="text-sm text-muted">{L(b.type)}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-extrabold text-success">{score}%</div>
                    <div className="text-[11px] text-muted">match</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{L(b.description)}</p>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{tr('สนใจ', 'Interested in')}</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {b.interests.map((c) => <Badge key={c} tone={c === me.category ? 'success' : 'brand'}>{L(CATEGORIES[c])}</Badge>)}
            </div>
            <div className="mt-3 grid gap-1.5 text-sm">
              <div className="flex items-center gap-2"><Globe2 size={15} className="text-muted" /> {L(b.country)}</div>
              <div className="flex items-center gap-2"><Wallet size={15} className="text-muted" /> {b.budget}</div>
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
              <span className="text-xs text-muted">{tr(`ว่าง ${30 - b.slotsTaken.length} ช่วงเวลา`, `${30 - b.slotsTaken.length} slots open`)}</span>
              <LinkButton to={`/matching/request/${b.id}`}>{tr('ขอนัดประชุม', 'Request Meeting')}</LinkButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
