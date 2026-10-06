import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Briefcase, ClipboardList, FileSpreadsheet, Home, MessageSquareHeart, QrCode, ScanLine, Search, Store, TrendingUp, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { Card } from '../../components/ui/Card'
import { useDemoStore } from '../../store/demoStore'

type Step = { to: string; icon: typeof Home; th: string; en: string; dth: string; den: string }

const VISITOR: Step[] = [
  { to: '/', icon: Home, th: 'Landing', en: 'Landing', dth: 'ภาพรวมงาน 3 โซนหลัก', den: 'Event overview & 3 zones' },
  { to: '/register', icon: ClipboardList, th: 'ลงทะเบียน', en: 'Register', dth: 'ฟอร์ม 2 ขั้นตอน', den: '2-step form' },
  { to: '/register/success/latest', icon: QrCode, th: 'QR Code', en: 'QR Ticket', dth: 'บัตรเข้างานแบบ Wallet', den: 'Wallet-style ticket' },
  { to: '/staff/scan', icon: ScanLine, th: 'เช็คอิน', en: 'Check-in', dth: 'เจ้าหน้าที่สแกน QR', den: 'Staff scans the QR' },
  { to: '/exhibitors', icon: Search, th: 'ค้นหาผู้ออกบูธ', en: 'Explore Exhibitors', dth: 'Directory + e-Catalog', den: 'Directory + e-Catalog' },
  { to: '/matching', icon: Briefcase, th: 'Business Matching', en: 'Business Matching', dth: 'SME นัดพบ Buyer', den: 'SME meets buyers' },
  { to: '/survey', icon: MessageSquareHeart, th: 'แบบสอบถาม', en: 'Survey', dth: 'ความพึงพอใจ + NPS', den: 'Satisfaction + NPS' },
]

const ORGANIZER: Step[] = [
  { to: '/admin', icon: BarChart3, th: 'Admin Dashboard', en: 'Admin Dashboard', dth: 'KPI ทั้งงานแบบเรียลไทม์', den: 'Live event KPIs' },
  { to: '/admin/attendees', icon: Users, th: 'ข้อมูลผู้เข้างาน', en: 'Visitor Data', dth: 'ค้นหา กรอง Export', den: 'Search, filter, export' },
  { to: '/admin/exhibitors', icon: Store, th: 'ผู้ออกบูธ', en: 'Exhibitors', dth: 'อนุมัติ / แก้ไข', den: 'Approve / edit' },
  { to: '/admin/matching', icon: Briefcase, th: 'Business Matching', en: 'Business Matching', dth: 'ติดตามการนัดหมาย', den: 'Track meetings' },
  { to: '/admin/matching', icon: TrendingUp, th: 'มูลค่าดีล', en: 'Deal Value', dth: 'ยอดดีล + Forecast 1 ปี', den: 'Deals + 1-year forecast' },
  { to: '/admin/reports', icon: FileSpreadsheet, th: 'รายงาน', en: 'Report', dth: 'Export Excel', den: 'Export to Excel' },
]

function Flow({ steps, color }: { steps: Step[]; color: string }) {
  const { tr } = useI18n()
  const lastId = useDemoStore((s) => s.lastRegisteredId)
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => {
        const to = s.to.endsWith('/latest') ? (lastId ? `/register/success/${lastId}` : '/register') : s.to
        return (
          <li key={s.en + i}>
            <Link to={to} className="group flex h-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 transition-shadow hover:shadow-md">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: color }}><s.icon size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-muted">STEP {i + 1}</span>
                <span className="block font-semibold group-hover:text-brand">{tr(s.th, s.en)}</span>
                <span className="block text-xs text-muted">{tr(s.dth, s.den)}</span>
              </span>
              <ArrowRight size={16} className="mt-1 text-muted group-hover:text-brand" />
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export default function DemoStoryPage() {
  const { tr } = useI18n()
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="hero-bg rounded-3xl p-8 text-white sm:p-10">
        <div className="text-xs font-bold uppercase tracking-widest text-accent">Software Demo</div>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">MOC Expo 2026 Platform</h1>
        <p className="mt-3 max-w-2xl text-white/85">
          {tr('เส้นทางนำเสนอ 10–15 นาที: เริ่มจากประสบการณ์ผู้เข้าชม แล้วสลับเป็นผู้จัดงานเพื่อดูข้อมูลและ KPI', 'A 10–15 minute story: start with the visitor experience, then switch to the organizer to see the data and KPIs.')}
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          {['User Experience', 'Operation', 'Data', 'KPI'].map((t, i) => (
            <span key={t} className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20">{t}{i < 3 && <ArrowRight size={12} />}</span>
          ))}
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">1 · Visitor Journey</h2>
        <Flow steps={VISITOR} color="#0b3a82" />
      </section>
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">2 · {tr('สลับเป็นผู้จัดงาน', 'Switch to Organizer')}</h2>
        <Flow steps={ORGANIZER} color="#c2410c" />
      </section>

      <Card className="mt-10 p-5 text-sm text-muted">
        <div className="font-semibold text-fg">{tr('เคล็ดลับการนำเสนอ', 'Presenter tips')}</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{tr('ใช้ปุ่ม “Demo” มุมขวาล่างเพื่อสลับบทบาทและภาษาได้ทุกหน้า', 'Use the “Demo” button (bottom-right) to switch roles and language on any page.')}</li>
          <li>{tr('ข้อมูลที่กรอกระหว่างเดโมจะถูกนำไปคำนวณใน Dashboard ทันที (เก็บในเบราว์เซอร์นี้เท่านั้น)', 'Data entered during the demo flows into the dashboard immediately (stored in this browser only).')}</li>
          <li>{tr('กด “รีเซ็ตข้อมูลเดโม” ก่อนเริ่มนำเสนอรอบใหม่', 'Press “Reset demo data” before each new presentation.')}</li>
        </ul>
      </Card>
    </div>
  )
}
