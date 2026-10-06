import { useMemo, useState } from 'react'
import { Briefcase, Download, HandCoins, LineChart, Percent } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { BUYER_BY_ID } from '../../data/buyers'
import { EXHIBITOR_BY_ID } from '../../data/exhibitors'
import { useAllMeetings, useKpis } from '../../store/selectors'
import { PageHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Form'
import { KpiTile } from '../../components/ui/KpiTile'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { MeetingStatusBadge, OutcomeBadge } from '../../components/StatusBadges'
import { exportMeetings } from '../../lib/reports'
import type { Meeting, MeetingStatus } from '../../data/types'

export default function AdminMatchingPage() {
  const { tr, L, lang, fmtNumber, fmtMoney } = useI18n()
  const meetings = useAllMeetings()
  const k = useKpis()
  const [status, setStatus] = useState<MeetingStatus | ''>('')
  const [buyer, setBuyer] = useState('')

  const rows = useMemo(
    () => meetings.filter((m) => !status || m.status === status).filter((m) => !buyer || m.buyerId === buyer),
    [meetings, status, buyer],
  )

  const columns: Column<Meeting>[] = [
    { key: 'id', header: 'Meeting', render: (m) => (
      <div>
        <div className="font-mono text-xs text-muted">{m.id}</div>
        <div className="text-sm whitespace-nowrap">Day {m.day} · {m.time} · {m.table}</div>
      </div>
    ) },
    { key: 'sme', header: 'SME', render: (m) => <span className="font-semibold">{L(EXHIBITOR_BY_ID[m.exhibitorId].name)}</span> },
    { key: 'buyer', header: 'Buyer', render: (m) => BUYER_BY_ID[m.buyerId].name, hideOnMobile: true },
    { key: 'status', header: 'Status', render: (m) => <MeetingStatusBadge status={m.status} /> },
    { key: 'outcome', header: tr('ผล', 'Outcome'), render: (m) => (m.result ? <OutcomeBadge outcome={m.result.outcome} /> : <span className="text-muted">–</span>), hideOnMobile: true },
    { key: 'deal', header: 'Deal', className: 'text-right', render: (m) => <span className="tabular-nums">{m.result?.dealValue ? fmtMoney(m.result.dealValue) : '–'}</span> },
    { key: 'fc', header: 'Forecast', className: 'text-right', render: (m) => <span className="tabular-nums">{m.result?.forecast ? fmtMoney(m.result.forecast) : '–'}</span>, hideOnMobile: true },
  ]

  return (
    <div>
      <PageHeader eyebrow="Business Matching" title={tr('จัดการ Business Matching', 'Business Matching Management')}
        subtitle={tr('ติดตามการนัดหมาย ผลการเจรจา มูลค่าดีล และการคาดการณ์', 'Track meetings, outcomes, deal value and forecasts')}
        actions={<Button icon={<Download size={18} />} onClick={() => exportMeetings(rows, lang)}>Export Excel</Button>} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Completed Meetings" value={fmtNumber(k.matchingCompleted)} icon={<Briefcase size={16} />} />
        <KpiTile accent label="Deal Value" value={fmtMoney(k.dealValue, true)} icon={<HandCoins size={16} />} live={k.liveDeal ? `+${fmtMoney(k.liveDeal, true)} live` : undefined} />
        <KpiTile label="Forecast (1 yr)" value={fmtMoney(k.forecastValue, true)} icon={<LineChart size={16} />} />
        <KpiTile label={tr('อัตราปิดดีล', 'Deal conversion')} value={`${((k.deals / k.matchingCompleted) * 100).toFixed(1)}%`} sub={`${k.deals} deals`} icon={<Percent size={16} />} />
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:w-1/2">
        <Select value={status} onChange={(e) => setStatus(e.target.value as MeetingStatus | '')} aria-label="Status">
          <option value="">{tr('ทุกสถานะ', 'All statuses')}</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </Select>
        <Select value={buyer} onChange={(e) => setBuyer(e.target.value)} aria-label="Buyer">
          <option value="">{tr('ทุก Buyer', 'All buyers')}</option>
          {Object.values(BUYER_BY_ID).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </Select>
      </div>

      <DataTable rows={rows} columns={columns} rowKey={(m) => m.id} />
    </div>
  )
}
