// ข้อมูลสถิติจำลองสำหรับกราฟ Dashboard

/** ยอดลงทะเบียนรายวัน 30 วันก่อนงาน + 3 วันงาน (รวม = BASELINE.registered) */
export const REGISTRATION_TREND = (() => {
  const days: { date: string; count: number }[] = []
  const raw: number[] = []
  for (let i = 0; i < 33; i++) {
    const base = 90 + i * 9 + Math.round(40 * Math.sin(i / 2.3))
    raw.push(i >= 30 ? 330 - (i - 30) * 60 : base + (i % 7 === 5 || i % 7 === 6 ? 70 : 0))
  }
  const sum = raw.reduce((a, b) => a + b, 0)
  let acc = 0
  raw.forEach((r, i) => {
    const v = i === raw.length - 1 ? 8245 - acc : Math.round((r / sum) * 8245)
    acc += v
    const d = new Date(Date.UTC(2026, 10, 4 + i)) // 30 วันก่อนงาน + 3 วันงาน (4 พ.ย. – 6 ธ.ค.)
    days.push({ date: d.toISOString().slice(0, 10), count: v })
  })
  return days
})()

/** จำนวนเช็คอินรายชั่วโมงของ 3 วันงาน (รวม = BASELINE.checkedIn) */
export const CHECKIN_BY_HOUR = [
  { hour: '10:00', d1: 420, d2: 310, d3: 260 },
  { hour: '11:00', d1: 380, d2: 290, d3: 240 },
  { hour: '12:00', d1: 260, d2: 220, d3: 190 },
  { hour: '13:00', d1: 300, d2: 260, d3: 210 },
  { hour: '14:00', d1: 240, d2: 230, d3: 180 },
  { hour: '15:00', d1: 200, d2: 210, d3: 150 },
  { hour: '16:00', d1: 160, d2: 170, d3: 120 },
  { hour: '17:00', d1: 140, d2: 150, d3: 90 },
  { hour: '18:00', d1: 120, d2: 110, d3: 40 },
  { hour: '19:00', d1: 80, d2: 90, d3: 0 },
]

/** ยอดขายหน้างานแยกตามหมวด (บาท) */
export const SALES_BY_CATEGORY = [
  { category: 'food', value: 7_400_000 },
  { category: 'health', value: 3_100_000 },
  { category: 'fashion', value: 2_600_000 },
  { category: 'home', value: 2_150_000 },
  { category: 'craft', value: 1_480_000 },
  { category: 'agri', value: 1_120_000 },
  { category: 'service', value: 550_000 },
  { category: 'tech', value: 300_000 },
] as const

/** คะแนนความพึงพอใจเฉลี่ยตามหัวข้อ (เต็ม 5) */
export const SATISFACTION_BY_TOPIC = [
  { topic: 'registration', score: 4.71 },
  { topic: 'event', score: 4.55 },
  { topic: 'exhibitor', score: 4.48 },
  { topic: 'activity', score: 4.36 },
  { topic: 'venue', score: 4.42 },
  { topic: 'matching', score: 4.63 },
]
