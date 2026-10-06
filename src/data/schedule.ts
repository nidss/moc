import type { ScheduleItem } from './types'

type Row = [day: 1 | 2 | 3, start: string, end: string, th: string, en: string, stage: ScheduleItem['stage'], kind: ScheduleItem['kind'], speaker?: string]

const ROWS: Row[] = [
  [1, '10:00', '11:00', 'พิธีเปิดงาน MOC Expo 2026', 'Opening Ceremony', 'main', 'ceremony', 'Minister of Commerce'],
  [1, '11:00', '12:00', 'การทำคอนเทนต์ & การตลาดยุคใหม่', 'Content Creation & Modern Marketing', 'main', 'talk', 'Dr. Pimchanok S.'],
  [1, '13:00', '17:00', 'Business Matching รอบที่ 1', 'Business Matching Session 1', 'matching', 'matching'],
  [1, '13:00', '14:30', 'Workshop: ทำผลิตภัณฑ์สมุนไพรไทย', 'Workshop: Thai Herbal Products', 'workshop', 'workshop'],
  [1, '14:00', '15:00', 'การสร้างแบรนด์และภาพลักษณ์', 'Building Your Brand & Image', 'main', 'talk', 'Arthit W.'],
  [1, '16:00', '17:00', 'Influencer Talk: ปั้นแบรนด์ด้วยคอนเทนต์', 'Influencer Talk: Content-led Brands', 'main', 'talk', 'Mint & Friends'],
  [1, '17:30', '18:30', 'MOC TASTE: ชิมเมนูเชฟดัง', 'MOC TASTE: Celebrity Chef Tasting', 'taste', 'show'],
  [2, '10:00', '11:00', 'เทรนด์การค้าโลก 2027', 'Global Trade Trends 2027', 'main', 'talk', 'Kenji Tanaka'],
  [2, '10:00', '17:00', 'Business Matching รอบที่ 2', 'Business Matching Session 2', 'matching', 'matching'],
  [2, '11:00', '12:30', 'Workshop: การเพ้นท์หรือพับดอกไม้', 'Workshop: Flower Painting & Folding', 'workshop', 'workshop'],
  [2, '13:00', '14:00', 'โมเดลธุรกิจใหม่ในการสร้างรายได้', 'New Business Models for Revenue', 'main', 'talk'],
  [2, '14:30', '15:30', 'การดึงดูดนักลงทุนเพื่อขยายธุรกิจ', 'Attracting Investors to Scale Up', 'main', 'talk'],
  [2, '15:30', '16:30', 'Workshop: ทำเครื่องดื่มสมุนไพร', 'Workshop: Herbal Drinks', 'workshop', 'workshop'],
  [2, '17:00', '18:00', 'Live Commerce Challenge', 'Live Commerce Challenge', 'main', 'show'],
  [3, '10:00', '11:00', 'Tips & Tricks ข้อควรระวังในการทำธุรกิจ', 'Business Tips & Tricks: Pitfalls to Avoid', 'main', 'talk'],
  [3, '10:00', '15:00', 'Business Matching รอบที่ 3', 'Business Matching Session 3', 'matching', 'matching'],
  [3, '11:00', '12:30', 'Workshop: ทำผลิตภัณฑ์สมุนไพรไทย (รอบ 2)', 'Workshop: Thai Herbal Products (round 2)', 'workshop', 'workshop'],
  [3, '13:00', '14:00', 'การจุดประกาย สร้างแรงบันดาลใจให้ผู้ประกอบการ', 'Igniting Entrepreneurial Inspiration', 'main', 'talk'],
  [3, '14:00', '15:00', 'MOC TASTE: ร้านรางวัลเล่าเบื้องหลังความอร่อย', 'MOC TASTE: Award-winning Shops Behind the Scenes', 'taste', 'talk'],
  [3, '16:00', '17:00', 'สรุปผลการเจรจาธุรกิจ & พิธีปิด', 'Business Matching Results & Closing', 'main', 'ceremony'],
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
