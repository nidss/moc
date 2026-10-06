import { useMemo, useState } from 'react'
import { Download, Eye, Search } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ACTIVITY_INTERESTS, ATTENDEE_TYPES, BASELINE, CATEGORIES, OCCUPATIONS, PROVINCES } from '../../data/event'
import { useAttendees } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import { PageHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Form'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { CheckinBadge } from '../../components/StatusBadges'
import { exportAttendees } from '../../lib/reports'
import type { Attendee, AttendeeType } from '../../data/types'

export default function AttendeesPage() {
  const { tr, L, lang, fmtDate, fmtNumber } = useI18n()
  const all = useAttendees()
  const regCount = useDemoStore((s) => s.registrations.length)
  const checkIn = useDemoStore((s) => s.checkIn)
  const [q, setQ] = useState('')
  const [type, setType] = useState<AttendeeType | ''>('')
  const [status, setStatus] = useState<'' | 'in' | 'out'>('')
  const [view, setView] = useState<Attendee | null>(null)
  const [busy, setBusy] = useState(false)

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return all
      .filter((a) => !type || a.type === type)
      .filter((a) => !status || (status === 'in' ? !!a.checkedInAt : !a.checkedInAt))
      .filter((a) => !n || [a.name, a.id, a.phone, a.email, a.organization ?? ''].some((v) => v.toLowerCase().includes(n)))
  }, [all, q, type, status])

  const columns: Column<Attendee>[] = [
    { key: 'name', header: tr('ชื่อ', 'Name'), render: (a) => (
      <div>
        <div className="font-semibold">{a.name}</div>
        {a.organization && <div className="text-xs text-fg/80">{a.organization}</div>}
        <div className="font-mono text-xs text-muted">{a.id}</div>
      </div>
    ) },
    { key: 'type', header: tr('ประเภท', 'Type'), render: (a) => <Badge tone="brand">{L(ATTENDEE_TYPES[a.type])}</Badge> },
    { key: 'phone', header: tr('โทรศัพท์', 'Phone'), render: (a) => <span className="tabular-nums">{a.phone}</span>, hideOnMobile: true },
    { key: 'reg', header: tr('ลงทะเบียน', 'Registered'), render: (a) => fmtDate(a.registeredAt, { day: 'numeric', month: 'short' }), hideOnMobile: true },
    { key: 'ci', header: 'Check-in', render: (a) => <CheckinBadge at={a.checkedInAt} /> },
    { key: 'act', header: '', className: 'text-right', render: (a) => (
      <button onClick={() => setView(a)} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-brand" aria-label={`View ${a.name}`}><Eye size={18} /></button>
    ) },
  ]

  return (
    <div>
      <PageHeader eyebrow={tr('ผู้เข้าร่วมงาน', 'Attendees')} title={tr('จัดการผู้เข้าร่วมงาน', 'Attendee Management')}
        subtitle={tr(`ทั้งหมด ${fmtNumber(BASELINE.registered + regCount)} ราย · ตารางนี้แสดงข้อมูลตัวอย่าง ${fmtNumber(all.length)} รายการ`, `${fmtNumber(BASELINE.registered + regCount)} total · showing ${fmtNumber(all.length)} sample rows`)}
        actions={
          <Button icon={<Download size={18} />} disabled={busy}
            onClick={async () => { setBusy(true); try { await exportAttendees(rows, lang) } finally { setBusy(false) } }}>
            Export Excel
          </Button>
        } />

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_200px_200px]">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ค้นหาชื่อ บริษัท/หน่วยงาน เบอร์โทร อีเมล หรือ ID', 'Search name, company, phone, email or ID')} className="pl-10" aria-label="Search" />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value as AttendeeType | '')} aria-label="Type">
          <option value="">{tr('ทุกประเภท', 'All types')}</option>
          {Object.entries(ATTENDEE_TYPES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as '' | 'in' | 'out')} aria-label="Check-in status">
          <option value="">{tr('ทุกสถานะ', 'All statuses')}</option>
          <option value="in">{tr('เช็คอินแล้ว', 'Checked-in')}</option>
          <option value="out">{tr('ยังไม่เช็คอิน', 'Not checked-in')}</option>
        </Select>
      </div>

      <DataTable rows={rows} columns={columns} rowKey={(a) => a.id} onRowClick={setView} />

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name ?? ''}
        footer={view && !view.checkedInAt ? <Button variant="success" onClick={() => { checkIn(view.id); setView({ ...view, checkedInAt: new Date().toISOString() }) }}>{tr('เช็คอินด้วยตนเอง', 'Manual check-in')}</Button> : undefined}>
        {view && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Registration ID', <span className="font-mono">{view.id}</span>],
              [tr('ประเภท', 'Type'), L(ATTENDEE_TYPES[view.type])],
              [tr('โทรศัพท์', 'Phone'), view.phone],
              [tr('อีเมล', 'Email'), view.email],
              [tr('อายุ', 'Age'), view.age ?? '-'],
              [tr('อาชีพ', 'Occupation'), view.occupation ? L(OCCUPATIONS[view.occupation]) : '-'],
              [tr('บริษัท / หน่วยงาน', 'Company / organisation'), view.organization ?? '-'],
              [tr('จังหวัด', 'Province'), PROVINCES[view.province] ? L(PROVINCES[view.province]) : '-'],
              [tr('ลงทะเบียน', 'Registered'), fmtDate(view.registeredAt, { dateStyle: 'medium', timeStyle: 'short' })],
              ['Check-in', <CheckinBadge at={view.checkedInAt} />],
              [tr('สนใจ', 'Interests'), view.interests?.length ? view.interests.map((i) => L(CATEGORIES[i as keyof typeof CATEGORIES])).join(', ') : '-'],
              [tr('กิจกรรม', 'Activities'), view.activities?.length ? view.activities.map((i) => L(ACTIVITY_INTERESTS[i])).join(', ') : '-'],
            ].map(([k, v], i) => (
              <div key={i}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-0.5 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  )
}
