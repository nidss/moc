import { Badge, type Tone } from './ui/Badge'
import { useI18n } from '../i18n/I18nProvider'
import type { MeetingOutcome, MeetingStatus } from '../data/types'

export function MeetingStatusBadge({ status }: { status: MeetingStatus }) {
  const { tr } = useI18n()
  const map: Record<MeetingStatus, [Tone, string, string]> = {
    pending: ['warning', 'รอยืนยัน', 'Pending'],
    confirmed: ['brand', 'ยืนยันแล้ว', 'Confirmed'],
    completed: ['success', 'ประชุมแล้ว', 'Completed'],
    cancelled: ['danger', 'ยกเลิก', 'Cancelled'],
  }
  const [tone, th, en] = map[status]
  return <Badge tone={tone} dot>{tr(th, en)}</Badge>
}

export const OUTCOME_LABEL: Record<MeetingOutcome, [Tone, string, string]> = {
  interested: ['info', 'สนใจ', 'Interested'],
  followup: ['warning', 'ติดตามต่อ', 'Follow-up'],
  deal: ['success', 'ปิดดีล', 'Deal'],
  nodeal: ['neutral', 'ไม่ปิดดีล', 'No Deal'],
}

export function OutcomeBadge({ outcome }: { outcome: MeetingOutcome }) {
  const { tr } = useI18n()
  const [tone, th, en] = OUTCOME_LABEL[outcome]
  return <Badge tone={tone}>{tr(th, en)}</Badge>
}

export function CheckinBadge({ at }: { at?: string }) {
  const { tr } = useI18n()
  return at ? <Badge tone="success" dot>{tr('เช็คอินแล้ว', 'Checked-in')}</Badge> : <Badge tone="neutral" dot>{tr('ยังไม่เช็คอิน', 'Not yet')}</Badge>
}
