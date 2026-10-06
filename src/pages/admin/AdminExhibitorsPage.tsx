import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Check, Pencil, Plus, Search } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { CATEGORIES, PAVILIONS } from '../../data/event'
import { useExhibitors } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import { PageHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input, Select } from '../../components/ui/Form'
import { Badge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { OrgAvatar } from '../../components/Brand'
import type { Exhibitor } from '../../data/types'

export default function AdminExhibitorsPage() {
  const { tr, L } = useI18n()
  const exhibitors = useExhibitors()
  const setStatus = useDemoStore((s) => s.setExhibitorStatus)
  const [q, setQ] = useState('')
  const [status, setStatusFilter] = useState<'' | 'approved' | 'pending'>('')
  const [editing, setEditing] = useState<Exhibitor | 'new' | null>(null)
  const [saved, setSaved] = useState(false)

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase()
    return exhibitors
      .filter((e) => !status || e.status === status)
      .filter((e) => !n || [e.name.th, e.name.en, e.smeOneId].some((v) => v.toLowerCase().includes(n)))
      .sort((a, b) => (a.status === b.status ? 0 : a.status === 'pending' ? -1 : 1))
  }, [exhibitors, q, status])

  const pending = exhibitors.filter((e) => e.status === 'pending').length

  const columns: Column<Exhibitor>[] = [
    { key: 'sme', header: 'SME', render: (e) => (
      <div className="flex items-center gap-3">
        <OrgAvatar org={e} size="sm" />
        <div className="min-w-0">
          <div className="truncate font-semibold">{L(e.name)}</div>
          <div className="text-xs text-muted">{L(CATEGORIES[e.category])}</div>
        </div>
      </div>
    ) },
    { key: 'id', header: 'SME ONE ID', render: (e) => <span className="font-mono text-xs">{e.smeOneId}</span>, hideOnMobile: true },
    { key: 'pav', header: 'Pavilion', render: (e) => <span className="whitespace-nowrap">{PAVILIONS[e.pavilion].name} · {e.booth}</span>, hideOnMobile: true },
    { key: 'prod', header: tr('สินค้า', 'Products'), render: (e) => e.products.length, hideOnMobile: true },
    { key: 'status', header: 'Status', render: (e) => e.status === 'approved' ? <Badge tone="success" dot>{tr('อนุมัติแล้ว', 'Approved')}</Badge> : <Badge tone="warning" dot>{tr('รออนุมัติ', 'Pending')}</Badge> },
    { key: 'act', header: '', className: 'text-right', render: (e) => (
      <div className="flex justify-end gap-1">
        {e.status === 'pending' && (
          <Button size="sm" variant="success" icon={<Check size={14} />} onClick={() => setStatus(e.id, 'approved')}>{tr('อนุมัติ', 'Approve')}</Button>
        )}
        <button onClick={() => setEditing(e)} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-brand" aria-label="Edit"><Pencil size={16} /></button>
        <Link to={`/exhibitors/${e.id}`} className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-brand" aria-label="View catalog"><BookOpen size={16} /></Link>
      </div>
    ) },
  ]

  const ed = editing === 'new' ? null : editing

  return (
    <div>
      <PageHeader eyebrow={tr('ผู้ออกบูธ', 'Exhibitors')} title={tr('จัดการผู้ออกบูธ', 'Exhibitor Management')}
        subtitle={tr(`210 ราย (ตัวอย่าง ${exhibitors.length} ราย) · รออนุมัติ ${pending} ราย`, `210 exhibitors (${exhibitors.length} sample) · ${pending} pending approval`)}
        actions={<Button icon={<Plus size={18} />} onClick={() => setEditing('new')}>{tr('เพิ่มผู้ออกบูธ', 'Add exhibitor')}</Button>} />

      <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ค้นหาชื่อหรือ SME ONE ID', 'Search name or SME ONE ID')} className="pl-10" aria-label="Search" />
        </div>
        <Select value={status} onChange={(e) => setStatusFilter(e.target.value as '' | 'approved' | 'pending')} aria-label="Status">
          <option value="">{tr('ทุกสถานะ', 'All statuses')}</option>
          <option value="approved">{tr('อนุมัติแล้ว', 'Approved')}</option>
          <option value="pending">{tr('รออนุมัติ', 'Pending')}</option>
        </Select>
      </div>

      <DataTable rows={rows} columns={columns} rowKey={(e) => e.id} />

      <Modal open={editing !== null} onClose={() => { setEditing(null); setSaved(false) }}
        title={ed ? tr('แก้ไขผู้ออกบูธ', 'Edit exhibitor') : tr('เพิ่มผู้ออกบูธ', 'Add exhibitor')}
        footer={<>
          {saved && <span className="mr-auto self-center text-sm text-success">{tr('บันทึกแล้ว (เดโม)', 'Saved (demo)')}</span>}
          <Button variant="secondary" onClick={() => { setEditing(null); setSaved(false) }}>{tr('ปิด', 'Close')}</Button>
          <Button onClick={() => setSaved(true)}>{tr('บันทึก', 'Save')}</Button>
        </>}>
        <div className="grid gap-4 sm:grid-cols-2" key={ed?.id ?? 'new'}>
          <div className="sm:col-span-2"><Field label={tr('ชื่อบริษัท', 'Company name')}><Input defaultValue={ed ? L(ed.name) : ''} /></Field></div>
          <Field label="SME ONE ID" hint={tr('ดึงข้อมูลจาก SME ONE อัตโนมัติ', 'Auto-filled from SME ONE')}><Input defaultValue={ed?.smeOneId ?? ''} placeholder="SME1-XXXXXX" /></Field>
          <Field label="Booth"><Input defaultValue={ed?.booth ?? ''} placeholder="A-01" /></Field>
          <Field label="Pavilion">
            <Select defaultValue={ed?.pavilion ?? 'local'}>{Object.entries(PAVILIONS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}</Select>
          </Field>
          <Field label={tr('หมวดหมู่', 'Category')}>
            <Select defaultValue={ed?.category ?? 'food'}>{Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}</Select>
          </Field>
          <Field label={tr('ผู้ติดต่อ', 'Contact')}><Input defaultValue={ed?.contact.name ?? ''} /></Field>
          <Field label={tr('โทรศัพท์', 'Phone')}><Input defaultValue={ed?.contact.phone ?? ''} /></Field>
        </div>
      </Modal>
    </div>
  )
}
