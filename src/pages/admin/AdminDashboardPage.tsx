import { ArrowRight, Briefcase, HandCoins, LineChart, Store, UserCheck, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ATTENDEE_TYPES, CATEGORIES, SURVEY_TOPICS } from '../../data/event'
import { CHECKIN_BY_HOUR, REGISTRATION_TREND, SALES_BY_CATEGORY, SATISFACTION_BY_TOPIC } from '../../data/analytics'
import { useKpis } from '../../store/selectors'
import { KpiTile } from '../../components/ui/KpiTile'
import { PageHeader } from '../../components/ui/Card'
import { LinkButton } from '../../components/ui/Button'
import { ChartCard, HBarList, MultiLine, TrendArea } from '../../components/Charts'
import type { AttendeeType } from '../../data/types'

export default function AdminDashboardPage() {
  const { tr, L, fmtNumber, fmtMoney, fmtDate } = useI18n()
  const k = useKpis()
  const impact = k.salesOnsite + k.dealValue + k.forecastValue

  const flow = [
    { label: tr('ผู้เข้างาน', 'Visitors'), value: fmtNumber(k.checkedIn) },
    { label: 'SME', value: fmtNumber(k.exhibitors) },
    { label: 'Matching', value: fmtNumber(k.matchingCompleted) },
    { label: tr('ยอดขาย + ดีล', 'Sales + Deals'), value: fmtMoney(k.salesOnsite + k.dealValue, true) },
    { label: 'Economic Impact', value: fmtMoney(impact, true), strong: true },
  ]

  return (
    <div>
      <PageHeader eyebrow={tr('ภาพรวมโครงการ', 'Project overview')} title={tr('Dashboard ผู้จัดงาน', 'Organizer Dashboard')}
        subtitle={tr('ข้อมูลอัปเดตแบบเรียลไทม์จากการลงทะเบียน เช็คอิน และ Business Matching', 'Live data from registration, check-in and Business Matching')}
        actions={<LinkButton to="/admin/reports" variant="secondary">{tr('รายงาน & Export', 'Reports & Export')}</LinkButton>} />

      {/* เส้นทางสู่ผลลัพธ์ทางเศรษฐกิจ */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-[#061a3d] text-white">
        <div className="grid grid-cols-2 sm:grid-cols-5">
          {flow.map((f, i) => (
            <div key={f.label} className={`relative p-4 sm:p-5 ${f.strong ? 'col-span-2 bg-accent text-[#1a1200] sm:col-span-1' : ''}`}>
              <div className={`text-xs font-semibold ${f.strong ? 'opacity-80' : 'text-white/60'}`}>{f.label}</div>
              <div className="mt-1 text-xl font-extrabold sm:text-2xl">{f.value}</div>
              {i < flow.length - 1 && <ArrowRight size={16} className="absolute top-1/2 right-1 hidden -translate-y-1/2 text-white/30 sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <KpiTile label="Registered" value={fmtNumber(k.registered)} icon={<Users size={16} />} live={k.liveRegistrations ? `+${k.liveRegistrations} live` : undefined} />
        <KpiTile label="Checked-in" value={fmtNumber(k.checkedIn)} sub={`${(k.attendance * 100).toFixed(1)}% attendance`} icon={<UserCheck size={16} />} live={k.liveCheckins ? `+${k.liveCheckins} live` : undefined} />
        <KpiTile label="Exhibitors" value={fmtNumber(k.exhibitors)} sub={tr('5 Pavilions', '5 pavilions')} icon={<Store size={16} />} />
        <KpiTile label="Business Matching" value={fmtNumber(k.matchingCompleted)} sub={tr(`${k.deals} ดีล`, `${k.deals} deals`)} icon={<Briefcase size={16} />} />
        <KpiTile accent label="Deal Value" value={fmtMoney(k.dealValue, true)} icon={<HandCoins size={16} />} live={k.liveDeal ? `+${fmtMoney(k.liveDeal, true)} live` : undefined} />
        <KpiTile label="Forecast Value" value={fmtMoney(k.forecastValue, true)} sub={tr('คาดการณ์ 1 ปี', '1-year forecast')} icon={<LineChart size={16} />} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title={tr('แนวโน้มการลงทะเบียน', 'Registration trend')} subtitle={tr('ยอดลงทะเบียนรายวัน', 'Daily registrations')}>
          <TrendArea data={REGISTRATION_TREND} x="date" y="count" name="Registrations" format={fmtNumber}
            tickFormat={(d) => fmtDate(d, { day: 'numeric', month: 'short' })} labelFormat={(d) => fmtDate(d)} />
        </ChartCard>
        <ChartCard title={tr('การเช็คอินผู้เข้างาน', 'Visitor check-in')} subtitle={tr('เช็คอินต่อชั่วโมง แยกตามวัน', 'Check-ins per hour by day')}>
          <MultiLine data={CHECKIN_BY_HOUR} x="hour" format={fmtNumber}
            series={[{ key: 'd1', name: 'Day 1' }, { key: 'd2', name: 'Day 2' }, { key: 'd3', name: 'Day 3' }]} height={216} />
        </ChartCard>
        <ChartCard title={tr('ประเภทผู้เข้างาน', 'Visitor category')} subtitle={tr('จำนวนผู้ลงทะเบียน', 'Registered attendees')}>
          <HBarList format={fmtNumber}
            rows={(Object.keys(ATTENDEE_TYPES) as AttendeeType[]).map((t) => ({ label: L(ATTENDEE_TYPES[t]), value: k.byType[t] }))} />
        </ChartCard>
        <ChartCard title="Business Matching" subtitle={tr('จากการนัดหมายสู่การปิดดีล', 'From meetings to closed deals')}>
          <HBarList format={fmtNumber} max={k.matchingScheduled}
            rows={[
              { label: tr('นัดหมายทั้งหมด', 'Meetings scheduled'), value: k.matchingScheduled },
              { label: tr('ประชุมแล้ว', 'Meetings completed'), value: k.matchingCompleted },
              { label: tr('สนใจ / ติดตามต่อ', 'Interested / follow-up'), value: Math.round(k.matchingCompleted * 0.42) },
              { label: tr('ปิดดีล', 'Deals closed'), value: k.deals },
            ]} />
        </ChartCard>
        <ChartCard title={tr('ยอดขายหน้างาน', 'Onsite sales')} subtitle={`${tr('รวม', 'Total')} ${fmtMoney(k.salesOnsite)}`}>
          <HBarList format={(v) => fmtMoney(v, true)} rows={SALES_BY_CATEGORY.map((r) => ({ label: L(CATEGORIES[r.category]), value: r.value }))} />
        </ChartCard>
        <ChartCard title={tr('ความพึงพอใจ', 'Satisfaction')} subtitle={tr(`${fmtNumber(k.surveyResponses)} คำตอบ · NPS +${k.nps}`, `${fmtNumber(k.surveyResponses)} responses · NPS +${k.nps}`)}
          action={<div className="text-right"><div className="text-2xl font-extrabold">{k.satisfaction.toFixed(2)}</div><div className="text-xs text-muted">/ 5.00</div></div>}>
          <HBarList format={(v) => v.toFixed(2)} max={5}
            rows={SATISFACTION_BY_TOPIC.map((r) => {
              const t = SURVEY_TOPICS.find((x) => x.id === r.topic)!
              return { label: tr(t.th, t.en), value: r.score }
            })} />
        </ChartCard>
      </div>
    </div>
  )
}
