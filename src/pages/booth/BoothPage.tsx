import { useState } from 'react'
import { ScanLine, Users, Download, Search, Sparkles, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useAttendees, useExhibitors } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import type { BoothLead } from '../../data/types'
import { QrScanner } from '../../components/QrScanner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Form'
import { exportExcel } from '../../lib/download'

export default function BoothPage() {
  const { tr, L, fmtNumber } = useI18n()
  const exhibitors = useExhibitors().filter((e) => e.status === 'approved')
  const attendees = useAttendees()
  const leads = useDemoStore((s) => s.boothLeads)
  const saveLead = useDemoStore((s) => s.saveBoothLead)
  const lastId = useDemoStore((s) => s.lastRegisteredId)
  const [boothId, setBoothId] = useState(exhibitors[0]?.id ?? '')
  const [tab, setTab] = useState<'scan' | 'leads'>('scan')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [interest, setInterest] = useState<BoothLead['interest']>('visited')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const booth = exhibitors.find((e) => e.id === boothId)
  const selected = attendees.find((a) => a.id === selectedId)
  const boothLeads = leads.filter((l) => l.exhibitorId === boothId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const existing = boothLeads.find((l) => l.attendeeId === selectedId)
  const needle = query.trim().toLowerCase()
  const matches = needle.length >= 2 ? attendees.filter((a) => [a.id, a.name, a.phone, a.email].some((v) => v.toLowerCase().includes(needle))).slice(0, 6) : []
  const labels = {
    visited: tr('เข้าชมบูธ', 'Visited'),
    interested: tr('สนใจสินค้า', 'Interested'),
    followup: tr('ต้องติดตามต่อ', 'Follow up'),
  }
  const selectAttendee = (text: string) => {
    const attendee = attendees.find((a) => a.id.toLowerCase() === text.trim().toLowerCase())
    setMessage('')
    setError('')
    setSelectedId(undefined)
    if (!attendee) {
      setError(tr('ไม่พบผู้ลงทะเบียนสำหรับ QR นี้ กรุณาสแกน QR Ticket ของงาน หรือค้นหาด้วยตนเอง', 'Registration not found. Scan an event QR ticket or use manual search.'))
      return
    }
    const lead = boothLeads.find((l) => l.attendeeId === attendee.id)
    setSelectedId(attendee.id)
    setInterest(lead?.interest ?? 'visited')
    setNote(lead?.note ?? '')
  }
  const save = () => {
    if (!selected || !booth) return
    if (!saveLead({ exhibitorId: booth.id, attendeeId: selected.id, interest, note: note.trim() })) {
      setError(tr('ไม่สามารถบันทึกข้อมูลได้ กรุณาเลือกบูธและผู้ลงทะเบียนอีกครั้ง', 'Unable to save. Select the booth and attendee again.'))
      return
    }
    setMessage(tr(`บันทึก ${selected.name} ให้บูธ ${booth.booth} แล้ว`, `Saved ${selected.name} to booth ${booth.booth}.`))
    setSelectedId(undefined)
    setQuery('')
  }
  const download = async () => {
    if (!booth) return
    setExporting(true)
    setError('')
    try {
      await exportExcel(`booth-${booth.id}-leads`,
        [tr('บูธ', 'Booth'), 'Registration ID', tr('ชื่อ', 'Name'), tr('องค์กร', 'Organization'), tr('โทรศัพท์', 'Phone'), tr('อีเมล', 'Email'), tr('ความสนใจ', 'Interest'), tr('หมายเหตุ', 'Note'), tr('บันทึกครั้งแรก', 'First recorded'), tr('แก้ไขล่าสุด', 'Updated')],
        boothLeads.map((lead) => {
          const a = attendees.find((x) => x.id === lead.attendeeId)
          return [booth.booth, lead.attendeeId, a?.name ?? '', a?.organization ?? '', a?.phone ?? '', a?.email ?? '', labels[lead.interest], lead.note, lead.createdAt, lead.updatedAt]
        }), 'Booth leads')
    } catch {
      setError(tr('ส่งออกไม่สำเร็จ กรุณาลองอีกครั้ง', 'Export failed. Please try again.'))
    } finally { setExporting(false) }
  }
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8 sm:px-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><ScanLine className="text-brand" /> {tr('เจ้าของบูธ', 'Booth owner')}</h1>
        <p className="mt-2 text-sm text-muted">{tr('สแกน QR Ticket เพื่อเก็บรายชื่อผู้เข้าชมและผู้สนใจในบูธของคุณ', 'Scan event QR tickets to collect visitors and leads for your booth.')}</p>
      </div>
      <Card className="space-y-3 p-4">
        <Field label={tr('บูธของคุณ (เลือกเพื่อสาธิต)', 'Your booth (demo selection)')}>
          <Select value={boothId} onChange={(e) => { setBoothId(e.target.value); setSelectedId(undefined); setMessage(''); setError(''); setQuery('') }}>
            {exhibitors.map((e) => <option key={e.id} value={e.id}>{e.booth} · {L(e.name)}</option>)}
          </Select>
        </Field>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>{tr('ผู้เข้าชม', 'Visitors')}: <strong>{fmtNumber(boothLeads.length)}</strong></span>
          <span>{tr('ผู้สนใจ / ติดตามต่อ', 'Interested / follow up')}: <strong>{fmtNumber(boothLeads.filter((l) => l.interest !== 'visited').length)}</strong></span>
        </div>
        <p className="text-xs text-muted">{tr('โหมดเดโม: เก็บข้อมูลเฉพาะเบราว์เซอร์นี้ แยกจากเช็คอินเข้างาน และเลือกบูธได้โดยไม่มีระบบล็อกอิน', 'Demo: stored in this browser, separate from event check-in. Booth selection has no login.')}</p>
      </Card>
      <div className="flex gap-2" role="group" aria-label={tr('เมนูเจ้าของบูธ', 'Booth owner navigation')}>
        <Button variant={tab === 'scan' ? 'primary' : 'secondary'} icon={<ScanLine size={18} />} onClick={() => { setTab('scan'); setError('') }}>{tr('สแกนผู้เข้าชม', 'Scan visitor')}</Button>
        <Button variant={tab === 'leads' ? 'primary' : 'secondary'} icon={<Users size={18} />} onClick={() => { setTab('leads'); setSelectedId(undefined); setError('') }}>{tr('รายชื่อผู้สนใจ', 'Visitor & lead list')}</Button>
      </div>
      {message && <div role="status" className="flex items-center gap-2 rounded-xl bg-brand-soft p-4 text-sm"><CheckCircle2 size={18} />{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-danger p-4 text-sm text-danger">{error}</div>}
      {!booth ? <p>{tr('ไม่มีบูธที่พร้อมใช้งาน', 'No available booth')}</p> : tab === 'scan' ? <>
        {!selected ? <>
          <QrScanner key={boothId} onResult={selectAttendee} />
          <Button variant="accent" className="w-full" icon={<Sparkles size={18} />} onClick={() => { const a = attendees.find((x) => x.id === lastId) ?? attendees[0]; if (a) selectAttendee(a.id) }}>{tr('จำลองการสแกน (สำหรับเดโม)', 'Simulate scan (demo)')}</Button>
          <Card className="space-y-3 p-4">
            <Field label={<span className="flex items-center gap-2"><Search size={18} />{tr('ค้นหาด้วยตนเอง', 'Manual search')}</span>}>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tr('ชื่อ / เบอร์โทร / อีเมล / Registration ID', 'Name / phone / email / Registration ID')} />
            </Field>
            {matches.map((a) => <button key={a.id} onClick={() => selectAttendee(a.id)} className="block w-full rounded-xl bg-surface-2 p-3 text-left hover:bg-brand-soft"><div className="font-semibold">{a.name}</div><div className="text-xs text-muted">{a.id} · {a.organization || a.province}</div></button>)}
            {needle.length >= 2 && !matches.length && <p className="text-sm text-muted">{tr('ไม่พบรายชื่อ', 'No match found')}</p>}
          </Card>
        </> : <Card className="space-y-4 p-5">
          <div><h2 className="text-lg font-bold">{selected.name}</h2><p className="text-sm text-muted">{selected.id} · {selected.organization || selected.province}</p><p className="mt-2 text-sm break-all">{selected.phone} · {selected.email}</p></div>
          {existing && <p role="status" className="rounded-xl bg-brand-soft p-3 text-sm">{tr('มีรายชื่อในบูธนี้แล้ว บันทึกเพื่อแก้ไขข้อมูลโดยไม่เพิ่มรายชื่อซ้ำ', 'Already recorded for this booth. Saving updates the existing lead without a duplicate.')}</p>}
          <Field label={tr('ความสนใจ', 'Interest')}><Select value={interest} onChange={(e) => setInterest(e.target.value as BoothLead['interest'])}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>
          <Field label={tr('หมายเหตุ / สินค้าที่สนใจ', 'Notes / products of interest')}><Textarea value={note} maxLength={2000} onChange={(e) => setNote(e.target.value)} /></Field>
          <p className="text-xs text-muted">{tr('แจ้งผู้เข้าชมก่อนบันทึกข้อมูลติดต่อเพื่อติดตามความสนใจ', 'Let the visitor know before recording contact details for follow-up.')}</p>
          <div className="flex flex-wrap gap-2"><Button onClick={save}>{existing ? tr('บันทึกการแก้ไข', 'Update lead') : tr('ยืนยันบันทึกผู้เข้าชม', 'Confirm visitor')}</Button><Button variant="secondary" onClick={() => setSelectedId(undefined)}>{tr('ยกเลิก / สแกนคนถัดไป', 'Cancel / scan next')}</Button></div>
        </Card>}
      </> : <>
        <Button variant="secondary" disabled={!boothLeads.length || exporting} icon={<Download size={18} />} onClick={() => void download()}>{exporting ? tr('กำลังส่งออก...', 'Exporting...') : tr('ส่งออกรายชื่อ Excel', 'Export leads to Excel')}</Button>
        {!boothLeads.length && <Card className="p-8 text-center text-muted">{tr('ยังไม่มีผู้เข้าชมบูธ เริ่มจากสแกน QR Ticket', 'No visitors recorded yet. Start by scanning a QR ticket.')}</Card>}
        {boothLeads.map((lead) => {
          const a = attendees.find((x) => x.id === lead.attendeeId)
          return <Card key={lead.attendeeId} className="space-y-2 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-bold">{a?.name ?? lead.attendeeId}</h2><p className="text-xs text-muted">{lead.attendeeId} · {a?.organization || a?.province}</p></div><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold">{labels[lead.interest]}</span></div>
            <p className="text-sm break-all">{a?.phone} · {a?.email}</p>
            {lead.note && <p className="whitespace-pre-wrap break-words text-sm">{lead.note}</p>}
            <p className="text-xs text-muted">{tr('บันทึกครั้งแรก', 'First recorded')}: {new Date(lead.createdAt).toLocaleString()}</p>
            <Button size="sm" variant="secondary" onClick={() => { setTab('scan'); selectAttendee(lead.attendeeId) }}>{tr('แก้ไขความสนใจ / หมายเหตุ', 'Edit interest / notes')}</Button>
          </Card>
        })}
      </>}
    </div>
  )
}
