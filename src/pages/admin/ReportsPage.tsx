import { useState } from 'react'
import { Briefcase, Download, FileSpreadsheet, Loader2, ScanLine, ShoppingBag, Smile, Store, Users, type LucideIcon } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { SALES_BY_CATEGORY } from '../../data/analytics'
import { useAllMeetings, useAttendees, useExhibitors } from '../../store/selectors'
import { useDemoStore } from '../../store/demoStore'
import { Card, PageHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { exportAttendees, exportCheckins, exportExhibitors, exportMeetings, exportSales, exportSatisfaction } from '../../lib/reports'

type Report = { id: string; icon: LucideIcon; th: string; en: string; dth: string; den: string; rows: number; run: () => Promise<void> }

export default function ReportsPage() {
  const { tr, lang, fmtNumber } = useI18n()
  const attendees = useAttendees()
  const exhibitors = useExhibitors()
  const meetings = useAllMeetings()
  const surveys = useDemoStore((s) => s.surveys)
  const [busy, setBusy] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  const reports: Report[] = [
    { id: 'attendee', icon: Users, th: 'รายงานผู้เข้าร่วมงาน', en: 'Attendee Report', dth: 'ข้อมูลผู้ลงทะเบียนทั้งหมด ประเภท จังหวัด และสถานะ', den: 'All registrations with type, province and status', rows: attendees.length, run: () => exportAttendees(attendees, lang) },
    { id: 'exhibitor', icon: Store, th: 'รายงานผู้ออกบูธ', en: 'Exhibitor Report', dth: 'SME ONE ID, Pavilion, Booth และข้อมูลติดต่อ', den: 'SME ONE ID, pavilion, booth and contacts', rows: exhibitors.length, run: () => exportExhibitors(exhibitors, lang) },
    { id: 'checkin', icon: ScanLine, th: 'รายงานการเช็คอิน', en: 'Check-in Report', dth: 'รายชื่อและเวลาเช็คอินเข้างาน', den: 'Attendees and check-in timestamps', rows: attendees.filter((a) => a.checkedInAt).length, run: () => exportCheckins(attendees, lang) },
    { id: 'sales', icon: ShoppingBag, th: 'รายงานยอดขาย', en: 'Sales Report', dth: 'ยอดขายหน้างานแยกตามหมวดสินค้า', den: 'Onsite sales by product category', rows: SALES_BY_CATEGORY.length + 1, run: () => exportSales(lang) },
    { id: 'matching', icon: Briefcase, th: 'รายงาน Business Matching', en: 'Business Matching Report', dth: 'การนัดหมาย ผลเจรจา มูลค่าดีล และ Forecast', den: 'Meetings, outcomes, deal value and forecast', rows: meetings.length, run: () => exportMeetings(meetings, lang) },
    { id: 'satisfaction', icon: Smile, th: 'รายงานความพึงพอใจ', en: 'Satisfaction Report', dth: 'คะแนนเฉลี่ยรายหัวข้อ และคำตอบแบบสอบถาม', den: 'Average scores by topic and survey responses', rows: 6 + surveys.length, run: () => exportSatisfaction(surveys) },
  ]

  const run = async (r: Report) => {
    setBusy(r.id)
    try {
      await r.run()
      setDone((d) => [...new Set([...d, r.id])])
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <PageHeader eyebrow={tr('รายงาน', 'Reports')} title={tr('รายงาน & Export', 'Report & Export')}
        subtitle={tr('ดาวน์โหลดรายงานเป็นไฟล์ Excel (.xlsx) สำหรับนำเสนอและส่งต่อหน่วยงาน', 'Download reports as Excel (.xlsx) for presentations and partner agencies')} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.id} className="flex flex-col p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-brand-soft p-2.5 text-brand"><r.icon size={22} /></div>
              <div>
                <div className="font-bold">{tr(r.th, r.en)}</div>
                <div className="mt-0.5 text-sm text-muted">{tr(r.dth, r.den)}</div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
              <span className="flex items-center gap-1.5 text-xs text-muted"><FileSpreadsheet size={14} /> {fmtNumber(r.rows)} {tr('แถว', 'rows')}{done.includes(r.id) && <span className="text-success"> · {tr('ดาวน์โหลดแล้ว', 'downloaded')}</span>}</span>
              <Button size="sm" variant={done.includes(r.id) ? 'secondary' : 'primary'} disabled={busy !== null} onClick={() => run(r)}
                icon={busy === r.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}>
                Export Excel
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
