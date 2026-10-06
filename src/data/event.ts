import type { LText } from '../i18n/I18nProvider'
import type { AttendeeType, CategoryId, PavilionId, ProductType } from './types'

export const EVENT = {
  name: 'MOC Expo 2026',
  slogan: 'CONNECT • COLLABORATE • GROW TOGETHER',
  tagline: {
    th: 'โครงการเชื่อมโยงการค้าและเจรจาธุรกิจผู้ประกอบการไทย',
    en: 'Trade Linkage & Business Matching for Thai Entrepreneurs',
  } as LText,
  quote: {
    th: 'เชื่อมโยงโอกาสทางการค้า เสริมศักยภาพธุรกิจไทย ก้าวไกลสู่เวทีโลก',
    en: 'Connecting trade opportunities, empowering Thai business, reaching the global stage',
  } as LText,
  days: ['2026-12-04', '2026-12-05', '2026-12-06'],
  dateLabel: { th: '4 – 6 ธันวาคม 2569', en: '4 – 6 December 2026' } as LText,
  hours: '10:00 – 20:00',
  venue: {
    th: 'ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC) Hall 7–8',
    en: 'Queen Sirikit National Convention Center (QSNCC), Hall 7–8',
  } as LText,
  area: 10_000,
  /** เป้าหมายโครงการตามเอกสารงาน */
  targets: { participants: 8_000, hubExhibitors: 200, tasteBooths: 100, economicValue: 100_000_000, budget: 25_000_000 },
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

/** โซนจัดแสดงสินค้า (เรียกในโค้ดว่า pavilion) */
export const PAVILIONS: Record<PavilionId, { name: string; zone: string; desc: LText; color: string }> = {
  hub: { name: 'MOC HUB', zone: 'Zone 1', desc: { th: 'Pavilion สินค้าและบริการให้คำปรึกษา จาก 9 หน่วยงานกระทรวงพาณิชย์', en: 'Products & advisory services from 9 MOC agencies' }, color: '#0a3480' },
  taste: { name: 'MOC TASTE', zone: 'Zone 3', desc: { th: 'ช้อปชิมอาหารเด็ด ร้านดัง ร้านรางวัล และร้านเชฟ', en: 'Award-winning, celebrity & chef food booths' }, color: '#a8721a' },
  private: { name: 'Private Pavilion', zone: 'Pavilion', desc: { th: 'พื้นที่ภาคเอกชน: Modern Trade เทคโนโลยี การเงิน สื่อสาร สุขภาพ', en: 'Private sector: modern trade, tech, finance, telecom, health' }, color: '#0e7490' },
}

/** หน่วยงานในสังกัดกระทรวงพาณิชย์ที่ร่วมจัด MOC HUB */
export const AGENCIES: Record<string, { short: string; name: LText }> = {
  DBD: { short: 'DBD', name: { th: 'กรมพัฒนาธุรกิจการค้า', en: 'Department of Business Development' } },
  DIP: { short: 'DIP', name: { th: 'กรมทรัพย์สินทางปัญญา', en: 'Department of Intellectual Property' } },
  DIT: { short: 'DIT', name: { th: 'กรมการค้าภายใน', en: 'Department of Internal Trade' } },
  DTN: { short: 'DTN', name: { th: 'กรมเจรจาการค้าระหว่างประเทศ', en: 'Department of Trade Negotiations' } },
  DFT: { short: 'DFT', name: { th: 'กรมการค้าต่างประเทศ', en: 'Department of Foreign Trade' } },
  DITP: { short: 'DITP', name: { th: 'กรมส่งเสริมการค้าระหว่างประเทศ', en: 'Department of International Trade Promotion' } },
  SACIT: { short: 'SACIT', name: { th: 'สถาบันส่งเสริมศิลปหัตถกรรมไทย', en: 'SACIT' } },
  GIT: { short: 'GIT', name: { th: 'สถาบันวิจัยและพัฒนาอัญมณีและเครื่องประดับแห่งชาติ', en: 'Gem and Jewelry Institute of Thailand' } },
  OPS: { short: 'OPS', name: { th: 'สำนักงานปลัดกระทรวงพาณิชย์', en: 'Office of the Permanent Secretary, MOC' } },
}

/** หน่วยงานพันธมิตร 5 หน่วยงาน */
export const PARTNERS: LText[] = [
  { th: 'บสย.', en: 'TCG' },
  { th: 'ธนาคารกรุงไทย', en: 'Krungthai Bank' },
  { th: 'ธนาคารออมสิน', en: 'Government Savings Bank' },
  { th: 'SME D Bank', en: 'SME D Bank' },
  { th: 'สสว.', en: 'OSMEP' },
]

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
  main: { th: 'เวที MOC UP SKILL', en: 'MOC UP SKILL Stage' },
  workshop: { th: 'ลาน Workshop', en: 'Workshop Corner' },
  matching: { th: 'Business Matching Lounge', en: 'Business Matching Lounge' },
  taste: { th: 'MOC TASTE', en: 'MOC TASTE' },
}

/** ตัวเลขฐานของงาน (สมมติ) — Dashboard จะบวกสิ่งที่ผู้ชม Demo ทำสดเพิ่มเข้าไป */
export const BASELINE = {
  registered: 8245,
  checkedIn: 5820,
  exhibitors: 300,
  hubExhibitors: 200,
  tasteBooths: 100,
  matchingCompleted: 428,
  dealValue: 24_500_000,
  forecastValue: 48_000_000,
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

/** ชื่อโซนสำหรับแสดงผล เช่น "Zone 1 · MOC HUB" หรือ "Private Pavilion" */
export const zoneLabel = (id: PavilionId) =>
  PAVILIONS[id].zone.startsWith('Zone') ? `${PAVILIONS[id].zone} · ${PAVILIONS[id].name}` : PAVILIONS[id].name
