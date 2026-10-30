import { useState } from 'react'
import { ScanLine, Users, Download, Search, Sparkles, CheckCircle2, Clock } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { useAttendees, usePortalMe } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import type { BoothLead } from '../../data/types'
import { QrScanner } from '../../components/QrScanner'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Field, Input, Textarea } from '../../components/ui/Form'
import { exportExcel } from '../../lib/download'
import { catalogProducts } from '../../lib/catalog'

/** ผู้เยี่ยมชมบูธ: สแกน QR Ticket ของผู้เข้างานเพื่อเก็บรายชื่อผู้สนใจ เฉพาะบูธของร้านที่ login อยู่ */
export default function BoothPage() {
  const { tr, L, fmtNumber } = useI18n()
  const booth = usePortalMe()
  const attendees = useAttendees()
  const leads = useDemoStore((s) => s.boothLeads)
  const saveLead = useDemoStore((s) => s.saveBoothLead)
  const lastId = useDemoStore((s) => s.lastRegisteredId)
  const [tab, setTab] = useState<'scan' | 'leads'>('scan')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const [interest, setInterest] = useState<BoothLead['interest']>('visited')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)
  const selected = attendees.find((a) => a.id === selectedId)
  const boothLeads = leads.filter((l) => l.exhibitorId === booth.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const existing = boothLeads.find((l) => l.attendeeId === selectedId)
  const needle = query.trim().toLowerCase()
  const matches = needle.length >= 2 ? attendees.filter((a) => [a.id, a.name, a.phone, a.email].some((v) => v.toLowerCase().includes(needle))).slice(0, 6) : []
  const products = catalogProducts(booth)
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
  const addProduct = (name: string) => {
    if (!note.includes(name)) setNote((n) => (n.trim() ? `${n.trim()}\n• ${name}` : `• ${name}`))
    if (interest === 'visited') setInterest('interested')
  }
  const save = () => {
    if (!selected) return
    if (!saveLead({ exhibitorId: booth.id, attendeeId: selected.id, interest, note: note.trim() })) {
      setError(tr('ไม่สามารถบันทึกข้อมูลได้ กรุณาสแกนอีกครั้ง', 'Unable to save. Please scan again.'))
      return
    }
    setMessage(tr(`บันทึก ${selected.name} ให้บูธ ${booth.booth} แล้ว`, `Saved ${selected.name} to booth ${booth.booth}.`))
    setSelectedId(undefined)
    setQuery('')
  }
  const download = async () => {
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

  if (booth.status !== 'approved') {
    return (
      <Card className="mx-auto max-w-xl p-8 text-center">
        <Clock className="mx-auto text-warning" size={32} />
        <h2 className="mt-3 text-lg font-bold">{tr('รอผู้จัดงานอนุมัติบูธ', 'Waiting for booth approval')}</h2>
        <p className="mt-1 text-sm text-muted">{tr('เมื่อบูธได้รับการอนุมัติ คุณจะสแกน QR Ticket ของผู้เข้าชมบูธและเก็บรายชื่อผู้สนใจได้ที่นี่', 'Once your booth is approved you can scan visitor QR tickets and collect leads here')}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1 rounded-xl border border-line bg-surface-2 p-1" role="group" aria-label={tr('เมนูผู้เยี่ยมชมบูธ', 'Booth visitor navigation')}>
          {([['scan', ScanLine, tr('สแกนผู้เยี่ยมชม', 'Scan visitor')], ['leads', Users, tr('รายชื่อผู้เข้าชม', 'Visitor list')]] as const).map(([k, Icon, label]) => (
            <button key={k} type="button" aria-pressed={tab === k} onClick={() => { setTab(k); setError(''); if (k === 'leads') setSelectedId(undefined) }}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-sm font-semibold ${tab === k ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-fg'}`}>
              <Icon size={16} /> {label}
              {k === 'leads' && boothLeads.length > 0 && <span className="rounded-full bg-accent px-1.5 text-[11px] text-on-accent">{boothLeads.length}</span>}
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          <Card className="px-4 py-2"><b className="text-lg">{fmtNumber(boothLeads.length)}</b> <span className="text-muted">{tr('ผู้เข้าชม', 'visitors')}</span></Card>
          <Card className="px-4 py-2"><b className="text-lg text-success">{fmtNumber(boothLeads.filter((l) => l.interest !== 'visited').length)}</b> <span className="text-muted">{tr('ผู้สนใจ / ติดตามต่อ', 'interested / follow up')}</span></Card>
        </div>
      </div>
      {message && <div role="status" className="flex items-center gap-2 rounded-xl bg-brand-soft p-4 text-sm"><CheckCircle2 size={18} />{message}</div>}
      {error && <div role="alert" className="rounded-xl border border-danger p-4 text-sm text-danger">{error}</div>}

      {tab === 'scan' ? (
        <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <Card className="space-y-4 p-5">
            <div className="text-sm font-semibold">{tr('สแกน QR Ticket ของผู้เข้างาน', 'Scan an attendee QR ticket')}</div>
            <QrScanner onResult={selectAttendee} />
            <Button variant="accent" className="w-full" icon={<Sparkles size={18} />} onClick={() => { const a = attendees.find((x) => x.id === lastId) ?? attendees[0]; if (a) selectAttendee(a.id) }}>{tr('จำลองการสแกน (สำหรับเดโม)', 'Simulate scan (demo)')}</Button>
            <Field label={<span className="flex items-center gap-2"><Search size={16} />{tr('หรือค้นหาด้วยตนเอง', 'Or search manually')}</span>}>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={tr('ชื่อ / เบอร์โทร / อีเมล / Registration ID', 'Name / phone / email / Registration ID')} />
            </Field>
            {matches.map((a) => <button key={a.id} onClick={() => selectAttendee(a.id)} className="block w-full rounded-xl bg-surface-2 p-3 text-left hover:bg-brand-soft"><div className="font-semibold">{a.name}</div><div className="text-xs text-muted">{a.id} · {a.organization || a.province}</div></button>)}
            {needle.length >= 2 && !matches.length && <p className="text-sm text-muted">{tr('ไม่พบรายชื่อ', 'No match found')}</p>}
            <p className="text-xs text-muted">{tr('การสแกนที่บูธไม่เปลี่ยนสถานะเช็คอินเข้างาน · รายชื่อเห็นเฉพาะร้านของคุณ', 'Booth scans do not change event check-in · leads are visible to your shop only')}</p>
          </Card>

          {!selected ? (
            <Card className="flex min-h-64 flex-col items-center justify-center p-8 text-center text-muted">
              <ScanLine size={32} />
              <div className="mt-3 font-semibold text-fg">{tr('สแกน QR Ticket เพื่อเริ่มบันทึกผู้เข้าชม', 'Scan a QR ticket to record a visitor')}</div>
              <div className="mt-1 text-sm">{tr(`บูธ ${booth.booth}`, `Booth ${booth.booth}`)}</div>
            </Card>
          ) : (
            <Card className="space-y-4 p-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-success">{tr('สแกนสำเร็จ', 'Scanned')} · {selected.id}</div>
                <h2 className="mt-1 text-xl font-bold">{selected.name}</h2>
                <p className="text-sm text-muted">{selected.organization || selected.province}</p>
                <p className="mt-2 rounded-xl bg-surface-2 p-3 text-sm break-all">{selected.phone} · {selected.email}</p>
              </div>
              {existing && <p role="status" className="rounded-xl bg-brand-soft p-3 text-sm">{tr('มีรายชื่อในบูธนี้แล้ว บันทึกเพื่อแก้ไขข้อมูลโดยไม่เพิ่มรายชื่อซ้ำ', 'Already recorded for this booth. Saving updates the existing lead without a duplicate.')}</p>}
              <div>
                <div className="mb-1.5 text-sm font-medium">{tr('ความสนใจ', 'Interest')}</div>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(labels) as BoothLead['interest'][]).map((k) => (
                    <button key={k} type="button" aria-pressed={interest === k} onClick={() => setInterest(k)}
                      className={`rounded-xl border p-3 text-sm font-semibold ${interest === k ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-brand/50'}`}>{labels[k]}</button>
                  ))}
                </div>
              </div>
              <Field label={tr('หมายเหตุ / สินค้าที่สนใจ', 'Notes / products of interest')}><Textarea value={note} maxLength={2000} onChange={(e) => setNote(e.target.value)} /></Field>
              {products.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {products.map((p) => (
                    <button key={p.id} type="button" onClick={() => addProduct(L(p.name))} className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand hover:brightness-95">+ {L(p.name)}</button>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted">{tr('แจ้งผู้เข้าชมก่อนบันทึกข้อมูลติดต่อเพื่อติดตามความสนใจ', 'Let the visitor know before recording contact details for follow-up.')}</p>
              <div className="flex flex-wrap justify-between gap-2">
                <Button variant="secondary" onClick={() => setSelectedId(undefined)}>{tr('ยกเลิก / สแกนคนถัดไป', 'Cancel / scan next')}</Button>
                <Button variant="accent" onClick={save}>{existing ? tr('บันทึกการแก้ไข', 'Update lead') : tr('ยืนยันบันทึกผู้เข้าชม', 'Confirm visitor')}</Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <Button variant="secondary" disabled={!boothLeads.length || exporting} icon={<Download size={18} />} onClick={() => void download()}>{exporting ? tr('กำลังส่งออก...', 'Exporting...') : tr('ส่งออกรายชื่อ Excel', 'Export leads to Excel')}</Button>
          {!boothLeads.length && <Card className="p-8 text-center text-muted">{tr('ยังไม่มีผู้เข้าชมบูธ เริ่มจากสแกน QR Ticket', 'No visitors recorded yet. Start by scanning a QR ticket.')}</Card>}
          <div className="grid gap-3 md:grid-cols-2">
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
          </div>
        </div>
      )}
    </div>
  )
}
