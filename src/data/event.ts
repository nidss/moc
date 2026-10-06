import type { LText } from '../i18n/I18nProvider'
import type { AttendeeType, CategoryId, PavilionId, ProductType } from './types'

export const EVENT = {
  name: 'MOC Expo 2026',
  tagline: {
    th: 'มหกรรมสินค้าและบริการ SME ไทย สู่ตลาดโลก',
    en: 'Thai SME Products & Services — From Local to Global',
  } as LText,
  days: ['2026-11-20', '2026-11-21', '2026-11-22'],
  dateLabel: { th: '20 – 22 พฤศจิกายน 2569', en: '20 – 22 November 2026' } as LText,
  hours: '10:00 – 20:00',
  venue: {
    th: 'ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC) กรุงเทพฯ',
    en: 'Queen Sirikit National Convention Center (QSNCC), Bangkok',
  } as LText,
}

export const CATEGORIES: Record<CategoryId, LText> = {
  food: { th: 'อาหารและเครื่องดื่ม', en: 'Food & Beverage' },
  health: { th: 'สุขภาพและความงาม', en: 'Health & Beauty' },
  fashion: { th: 'แฟชั่นและสิ่งทอ', en: 'Fashion & Textile' },
  home: { th: 'ของแต่งบ้านและไลฟ์สไตล์', en: 'Home & Lifestyle' },
  agri: { th: 'สินค้าเกษตร', en: 'Agriculture' },
  craft: { th: 'หัตถกรรม / OTOP', en: 'Handicraft / OTOP' },
  tech: { th: 'ดิจิทัลและนวัตกรรม', en: 'Digital & Innovation' },
  service: { th: 'บริการและแฟรนไชส์', en: 'Services & Franchise' },
}

export const PAVILIONS: Record<PavilionId, { name: string; desc: LText; color: string }> = {
  local: { name: 'MOC Local', desc: { th: 'สินค้าชุมชนและของดีประจำจังหวัด', en: 'Community products & provincial signatures' }, color: '#0b3a82' },
  smart: { name: 'MOC Smart Biz', desc: { th: 'SME ยุคดิจิทัลและนวัตกรรม', en: 'Digital-ready SMEs & innovation' }, color: '#0e7490' },
  global: { name: 'MOC Global', desc: { th: 'สินค้าพร้อมส่งออกสู่ตลาดโลก', en: 'Export-ready products' }, color: '#7c3aed' },
  franchise: { name: 'MOC Franchise', desc: { th: 'ธุรกิจแฟรนไชส์และบริการ', en: 'Franchise & service businesses' }, color: '#c2410c' },
  green: { name: 'MOC Green (BCG)', desc: { th: 'สินค้าเศรษฐกิจหมุนเวียนและรักษ์โลก', en: 'BCG & sustainable products' }, color: '#15803d' },
}

export const PRODUCT_TYPES: Record<ProductType, LText> = {
  consumer: { th: 'สินค้าอุปโภคบริโภค', en: 'Consumer goods' },
  processed: { th: 'สินค้าแปรรูป', en: 'Processed goods' },
  raw: { th: 'วัตถุดิบ', en: 'Raw materials' },
  service: { th: 'บริการ', en: 'Services' },
}

export const PROVINCES: Record<string, LText> = {
  bkk: { th: 'กรุงเทพมหานคร', en: 'Bangkok' },
  cmi: { th: 'เชียงใหม่', en: 'Chiang Mai' },
  cri: { th: 'เชียงราย', en: 'Chiang Rai' },
  kkn: { th: 'ขอนแก่น', en: 'Khon Kaen' },
  ubn: { th: 'อุบลราชธานี', en: 'Ubon Ratchathani' },
  nma: { th: 'นครราชสีมา', en: 'Nakhon Ratchasima' },
  ckh: { th: 'ชุมพร', en: 'Chumphon' },
  skm: { th: 'สมุทรสงคราม', en: 'Samut Songkhram' },
  pkt: { th: 'ภูเก็ต', en: 'Phuket' },
  sni: { th: 'สุราษฎร์ธานี', en: 'Surat Thani' },
  nan: { th: 'น่าน', en: 'Nan' },
  ryg: { th: 'ระยอง', en: 'Rayong' },
}

export const ATTENDEE_TYPES: Record<AttendeeType, LText> = {
  visitor: { th: 'ผู้เข้าชม', en: 'Visitor' },
  sme: { th: 'ผู้ประกอบการ SME', en: 'SME' },
  buyer: { th: 'ผู้ซื้อ (Buyer)', en: 'Buyer' },
  speaker: { th: 'วิทยากร', en: 'Speaker' },
  media: { th: 'สื่อมวลชน', en: 'Media' },
}

export const OCCUPATIONS: Record<string, LText> = {
  student: { th: 'นักเรียน / นักศึกษา', en: 'Student' },
  employee: { th: 'พนักงานบริษัท', en: 'Company employee' },
  owner: { th: 'เจ้าของธุรกิจ', en: 'Business owner' },
  gov: { th: 'ข้าราชการ / รัฐวิสาหกิจ', en: 'Government officer' },
  freelance: { th: 'อาชีพอิสระ', en: 'Freelance' },
  other: { th: 'อื่น ๆ', en: 'Other' },
}

export const ACTIVITY_INTERESTS: Record<string, LText> = {
  shopping: { th: 'ช้อปสินค้า SME', en: 'Shopping SME products' },
  workshop: { th: 'Workshop / Up Skill', en: 'Workshops / Up Skill' },
  talk: { th: 'สัมมนาบนเวที', en: 'Stage talks' },
  matching: { th: 'Business Matching', en: 'Business Matching' },
  franchise: { th: 'หาธุรกิจแฟรนไชส์', en: 'Franchise opportunities' },
}

export const STAGES: Record<string, LText> = {
  main: { th: 'Main Stage', en: 'Main Stage' },
  upskill: { th: 'MOC Up Skill', en: 'MOC Up Skill' },
  matching: { th: 'Matching Lounge', en: 'Matching Lounge' },
  green: { th: 'Green Stage', en: 'Green Stage' },
}

/** ตัวเลขฐานของงาน (สมมติ) — Dashboard จะบวกสิ่งที่ผู้ชม Demo ทำสดเพิ่มเข้าไป */
export const BASELINE = {
  registered: 8245,
  checkedIn: 5820,
  exhibitors: 210,
  matchingCompleted: 428,
  dealValue: 42_500_000,
  forecastValue: 108_000_000,
  satisfaction: 4.52,
  surveyResponses: 1864,
  nps: 62,
  byType: { visitor: 6420, sme: 980, buyer: 312, speaker: 48, media: 485 } as Record<AttendeeType, number>,
  checkedInByType: { visitor: 4410, sme: 862, buyer: 271, speaker: 44, media: 233 } as Record<AttendeeType, number>,
  salesOnsite: 18_700_000,
}

export const SURVEY_TOPICS: { id: string; th: string; en: string }[] = [
  { id: 'registration', th: 'การลงทะเบียน', en: 'Registration' },
  { id: 'event', th: 'ภาพรวมการจัดงาน', en: 'Event' },
  { id: 'exhibitor', th: 'ผู้ออกบูธและสินค้า', en: 'Exhibitors' },
  { id: 'activity', th: 'กิจกรรมและสัมมนา', en: 'Activities' },
  { id: 'venue', th: 'สถานที่', en: 'Venue' },
  { id: 'matching', th: 'Business Matching', en: 'Business Matching' },
]
