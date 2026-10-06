import { BUYERS, TIME_SLOTS } from './buyers'
import { EXHIBITORS, DEMO_SME_ID } from './exhibitors'
import { PROVINCES } from './event'
import type { Attendee, AttendeeType, Meeting, MeetingOutcome } from './types'

// PRNG แบบกำหนด seed เพื่อให้ข้อมูลตัวอย่างเหมือนเดิมทุกครั้งที่เปิด
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(2026)
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]

const FIRST = ['สมชาย', 'สมศรี', 'วิชัย', 'นภา', 'อรุณ', 'ปิยะ', 'กมล', 'ธนพร', 'จิราพร', 'ณัฐวุฒิ', 'พิมพ์ชนก', 'ศุภชัย', 'อัญชลี', 'กิตติ', 'มาลี', 'ประเสริฐ', 'วรรณา', 'ชยพล', 'ปวีณา', 'ธีรพงษ์', 'Emily', 'Kenji', 'Linh', 'Daniel']
const LAST = ['ใจดี', 'สุขสวัสดิ์', 'ทองคำ', 'ศรีสุข', 'วงศ์ไทย', 'แสงทอง', 'บุญมา', 'มั่นคง', 'รัตนพันธ์', 'พรหมมา', 'Tanaka', 'Nguyen', 'Smith']

const TYPE_WEIGHTS: [AttendeeType, number][] = [['visitor', 0.74], ['sme', 0.13], ['buyer', 0.05], ['speaker', 0.02], ['media', 0.06]]
function pickType(): AttendeeType {
  let r = rand()
  for (const [t, w] of TYPE_WEIGHTS) {
    if ((r -= w) <= 0) return t
  }
  return 'visitor'
}

const TYPE_PREFIX: Record<AttendeeType, string> = { visitor: 'V', sme: 'S', buyer: 'B', speaker: 'K', media: 'M' }
const PROVINCE_IDS = Object.keys(PROVINCES)

export function makeAttendeeId(type: AttendeeType, n: number) {
  return `MOC26-${TYPE_PREFIX[type]}${String(n).padStart(5, '0')}`
}

export const SEED_ATTENDEES: Attendee[] = Array.from({ length: 240 }, (_, i) => {
  const type = pickType()
  const regDay = 1 + Math.floor(rand() * 45) // ลงทะเบียนตั้งแต่ 6 ต.ค. ถึง 19 พ.ย.
  const registeredAt = new Date(Date.UTC(2026, 9, 5 + regDay, 1 + Math.floor(rand() * 14), Math.floor(rand() * 60))).toISOString()
  const checked = rand() < 0.7
  const ciDay = 20 + Math.floor(rand() * 3)
  const checkedInAt = checked
    ? new Date(Date.UTC(2026, 10, ciDay, 3 + Math.floor(rand() * 9), Math.floor(rand() * 60))).toISOString()
    : undefined
  const first = pick(FIRST)
  const last = pick(LAST)
  return {
    id: makeAttendeeId(type, 8000 - i * 7),
    name: `${first} ${last}`,
    type,
    phone: `08${Math.floor(rand() * 10)}-${String(Math.floor(rand() * 1000)).padStart(3, '0')}-${String(Math.floor(rand() * 10000)).padStart(4, '0')}`,
    email: `user${8000 - i * 7}@mail.example`,
    age: 18 + Math.floor(rand() * 45),
    province: pick(PROVINCE_IDS),
    registeredAt,
    checkedInAt,
  }
}).sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))

const OUTCOMES: MeetingOutcome[] = ['deal', 'deal', 'followup', 'interested', 'interested', 'nodeal']
const OBJ: Meeting['objective'][] = ['distribution', 'partnership', 'export', 'procurement']

/** การนัดหมายทั้งหมดที่เกิดขึ้นแล้ว (ใช้ในหน้า Admin) */
export const SEED_MEETINGS: Meeting[] = Array.from({ length: 48 }, (_, i) => {
  const ex = EXHIBITORS[(i * 5 + 3) % EXHIBITORS.length]
  const buyer = BUYERS[(i * 3) % BUYERS.length]
  const done = i < 36
  const outcome = OUTCOMES[i % OUTCOMES.length]
  const dealValue = outcome === 'deal' ? Math.round((150 + rand() * 1800) / 10) * 10_000 : 0
  return {
    id: `M${String(1000 + i)}`,
    exhibitorId: ex.id === DEMO_SME_ID ? EXHIBITORS[1].id : ex.id,
    buyerId: buyer.id,
    day: ((i % 3) + 1) as 1 | 2 | 3,
    time: TIME_SLOTS[i % TIME_SLOTS.length],
    table: `${'ABCD'[i % 4]}${String((i % 20) + 1).padStart(2, '0')}`,
    objective: OBJ[i % OBJ.length],
    status: done ? 'completed' : i % 5 === 0 ? 'pending' : 'confirmed',
    result: done
      ? {
          outcome,
          dealValue,
          forecast: outcome === 'deal' ? dealValue * (3 + Math.floor(rand() * 3)) : outcome === 'followup' ? Math.round(rand() * 80) * 10_000 : 0,
          note: '',
          savedAt: new Date(Date.UTC(2026, 10, 20 + (i % 3), 8)).toISOString(),
        }
      : undefined,
  }
})

/** การนัดหมายของ SME ตัวละครหลัก (Thai Organic Farm) ที่มีอยู่ก่อนเริ่มเดโม */
export const SEED_MY_MEETINGS: Meeting[] = [
  { id: 'M2001', exhibitorId: DEMO_SME_ID, buyerId: 'tokyo-foods', day: 1, time: '10:00', table: 'B12', objective: 'export', status: 'confirmed' },
  { id: 'M2002', exhibitorId: DEMO_SME_ID, buyerId: 'asean-trade', day: 1, time: '14:30', table: 'C04', objective: 'distribution', status: 'pending' },
]
