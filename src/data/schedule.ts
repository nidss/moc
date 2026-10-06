import type { ScheduleItem } from './types'

type Row = [day: 1 | 2 | 3, start: string, end: string, th: string, en: string, stage: ScheduleItem['stage'], kind: ScheduleItem['kind'], speaker?: string]

const ROWS: Row[] = [
  [1, '10:00', '11:00', 'พิธีเปิดงาน MOC Expo 2026', 'Opening Ceremony', 'main', 'ceremony', 'Minister of Commerce'],
  [1, '11:00', '12:00', 'SME Marketing 2026: ขายให้ปัง', 'SME Marketing 2026', 'upskill', 'workshop', 'Dr. Pimchanok S.'],
  [1, '13:00', '17:00', 'Business Matching รอบที่ 1', 'Business Matching Session 1', 'matching', 'matching'],
  [1, '13:30', '14:30', 'เปิดตลาดญี่ปุ่นด้วยสินค้าอาหารไทย', 'Entering Japan with Thai Food', 'main', 'talk', 'Kenji T.'],
  [1, '15:00', '16:00', 'Influencer Talk: ปั้นแบรนด์ด้วยคอนเทนต์', 'Influencer Talk: Content-led Brands', 'main', 'talk', 'Mint & Friends'],
  [1, '16:00', '17:00', 'Workshop: ถ่ายภาพสินค้าด้วยมือถือ', 'Workshop: Mobile Product Photography', 'upskill', 'workshop'],
  [1, '18:00', '19:00', 'แฟชั่นโชว์ผ้าไทยร่วมสมัย', 'Contemporary Thai Textile Show', 'main', 'show'],
  [2, '10:00', '11:00', 'เทรนด์ผู้บริโภค 2027', 'Consumer Trends 2027', 'main', 'talk', 'Retail Insight Team'],
  [2, '10:00', '17:00', 'Business Matching รอบที่ 2', 'Business Matching Session 2', 'matching', 'matching'],
  [2, '11:00', '12:30', 'Workshop: เปิดร้านออนไลน์ใน 1 วัน', 'Workshop: Launch an Online Store in a Day', 'upskill', 'workshop'],
  [2, '13:00', '14:00', 'BCG Economy: โอกาส SME สีเขียว', 'BCG Economy: Green SME Opportunities', 'green', 'talk'],
  [2, '14:00', '15:00', 'แฟรนไชส์ไทยสู่อาเซียน', 'Thai Franchises Going ASEAN', 'main', 'talk'],
  [2, '15:30', '16:30', 'Workshop: คำนวณต้นทุนและตั้งราคา', 'Workshop: Costing & Pricing', 'upskill', 'workshop'],
  [2, '17:00', '18:00', 'Live Commerce Challenge', 'Live Commerce Challenge', 'main', 'show'],
  [3, '10:00', '11:00', 'การเงินสำหรับ SME: สินเชื่อและแหล่งทุน', 'SME Finance & Funding', 'main', 'talk'],
  [3, '10:00', '15:00', 'Business Matching รอบที่ 3', 'Business Matching Session 3', 'matching', 'matching'],
  [3, '11:00', '12:00', 'Workshop: ขอเครื่องหมายมาตรฐานส่งออก', 'Workshop: Export Certification', 'upskill', 'workshop'],
  [3, '13:00', '14:00', 'บรรจุภัณฑ์รักษ์โลก', 'Sustainable Packaging', 'green', 'talk'],
  [3, '14:00', '15:00', 'AI สำหรับร้านค้า SME', 'AI for SME Shops', 'upskill', 'workshop'],
  [3, '16:00', '17:00', 'ประกาศรางวัล MOC SME Awards & พิธีปิด', 'MOC SME Awards & Closing', 'main', 'ceremony'],
]

export const SCHEDULE: ScheduleItem[] = ROWS.map(([day, start, end, th, en, stage, kind, speaker], i) => ({
  id: `s${i + 1}`,
  day,
  start,
  end,
  title: { th, en },
  stage,
  kind,
  speaker,
}))
