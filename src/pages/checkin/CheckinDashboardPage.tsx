import { useState } from 'react'
import { Percent, UserCheck, Users } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { ATTENDEE_TYPES } from '../../data/event'
import { CHECKIN_BY_HOUR } from '../../data/analytics'
import { useKpis } from '../../store/selectors'
import { KpiTile } from '../../components/ui/KpiTile'
import { Chip } from '../../components/ui/Form'
import { ChartCard, ColumnBars, HBarList } from '../../components/Charts'
import type { AttendeeType } from '../../data/types'

export default function CheckinDashboardPage() {
  const { tr, L, fmtNumber } = useI18n()
  const k = useKpis()
  const [day, setDay] = useState<'d1' | 'd2' | 'd3'>('d1')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{tr('สรุปการเช็คอิน', 'Check-in Dashboard')}</h1>
        <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
          <span className="size-2 animate-pulse rounded-full bg-success" /> Real-time
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiTile label={tr('ลงทะเบียน', 'Registered')} value={fmtNumber(k.registered)} icon={<Users size={16} />} live={k.liveRegistrations ? `+${k.liveRegistrations} live` : undefined} />
        <KpiTile label={tr('เช็คอินแล้ว', 'Checked-in')} value={fmtNumber(k.checkedIn)} icon={<UserCheck size={16} />} live={k.liveCheckins ? `+${k.liveCheckins} live` : undefined} />
        <div className="col-span-2 sm:col-span-1">
          <KpiTile accent label={tr('อัตราเข้างาน', 'Attendance')} value={`${(k.attendance * 100).toFixed(1)}%`} icon={<Percent size={16} />} />
        </div>
      </div>

      <ChartCard title={tr('เช็คอินแยกตามประเภท', 'Check-ins by attendee type')} subtitle={tr('เช็คอิน / ลงทะเบียน', 'checked-in / registered')}>
        <HBarList format={fmtNumber}
          rows={(Object.keys(ATTENDEE_TYPES) as AttendeeType[]).map((t) => ({
            label: L(ATTENDEE_TYPES[t]),
            value: k.checkedInByType[t],
            sub: `/ ${fmtNumber(k.byType[t])}`,
          }))} />
      </ChartCard>

      <ChartCard title={tr('ผู้เข้างานตามช่วงเวลา', 'Visitors by time')} subtitle={tr('จำนวนเช็คอินต่อชั่วโมง', 'Check-ins per hour')}
        action={
          <div className="flex gap-1.5">
            {(['d1', 'd2', 'd3'] as const).map((d, i) => <Chip key={d} active={day === d} onClick={() => setDay(d)} className="px-3! py-1! text-xs!">Day {i + 1}</Chip>)}
          </div>
        }>
        <ColumnBars data={CHECKIN_BY_HOUR} x="hour" y={day} name={tr('เช็คอิน', 'Check-ins')} format={fmtNumber} height={220} />
      </ChartCard>
    </div>
  )
}
