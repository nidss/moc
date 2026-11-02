import {
  Bot, Briefcase, Bus, CalendarDays, CirclePlay, Gift, Handshake, HelpCircle, Info, Map as MapIcon, Mic2, Newspaper, Store, Ticket, Wrench, type LucideIcon,
} from 'lucide-react'

/** เมนูของ V2: ลิงก์หลักไม่กี่อัน + เมนูย่อยสำหรับเนื้อหารองที่ย้ายออกจากหน้าแรก */
export type NavItemV2 = { to: string; th: string; en: string; dth?: string; den?: string; icon?: LucideIcon; end?: boolean }
export type NavGroupV2 = { id: string; th: string; en: string; items: NavItemV2[] }

export const PRIMARY_V2: NavItemV2[] = [
  { to: '/', th: 'หน้าแรก', en: 'Home', end: true },
  { to: '/exhibitors', th: 'ผู้ออกบูธ', en: 'Exhibitors' },
  { to: '/schedule', th: 'กำหนดการ', en: 'Schedule' },
  { to: '/floorplan', th: 'ผังงาน', en: 'Floor Plan' },
]

export const GROUPS_V2: NavGroupV2[] = [
  {
    id: 'activities', th: 'กิจกรรม', en: 'Activities',
    items: [
      { to: '/guide/workshop', icon: Wrench, th: 'Workshop & Live Commerce', en: 'Workshops & Live Commerce', dth: 'ลงมือทำจริง และไลฟ์ขายของกับครีเอเตอร์', den: 'Hands-on classes and live selling' },
      { to: '/guide/stage', icon: Mic2, th: 'เวทีกลาง', en: 'Centre Stage', dth: 'บันเทิง ฮีลใจ และกิจกรรมลุ้นรางวัล', den: 'Shows, wellbeing and lucky draws' },
      { to: '/guide/news', icon: Newspaper, th: 'ข่าว & Live Streaming', en: 'News & Live Streaming', dth: 'ประกาศล่าสุดและตารางถ่ายทอดสด', den: 'Latest updates and live schedule' },
      { to: '/guide/replays', icon: CirclePlay, th: 'คลิปย้อนหลัง', en: 'Replays', dth: 'ดูไฮไลต์และ Talk ย้อนหลัง', den: 'Highlights and past talks' },
    ],
  },
  {
    id: 'visit', th: 'เข้าชมงาน', en: 'Visit',
    items: [
      { to: '/guide/travel', icon: Bus, th: 'การเดินทาง & สิ่งอำนวยความสะดวก', en: 'Getting there & facilities', dth: 'MRT รถเมล์ ที่จอดรถ และบริการในงาน', den: 'MRT, bus, parking and on-site services' },
      { to: '/guide/promotions', icon: Gift, th: 'โปรโมชั่น & คูปอง', en: 'Promotions & coupons', dth: 'เก็บคูปองส่วนลดก่อนมางาน', den: 'Collect discount coupons before you go' },
      { to: '/guide/faq', icon: HelpCircle, th: 'คำถามที่พบบ่อย', en: 'FAQ', dth: 'ค่าเข้างาน การลงทะเบียน และอื่น ๆ', den: 'Entry, registration and more' },
      { to: '/event', icon: Info, th: 'เกี่ยวกับงาน', en: 'About the event', dth: 'วัตถุประสงค์ โซน และหน่วยงานร่วมจัด', den: 'Goals, zones and organisers' },
    ],
  },
  {
    id: 'business', th: 'ผู้ประกอบการ', en: 'Business',
    items: [
      { to: '/portal', icon: Store, th: 'ร้านค้าของฉัน', en: 'My Shop', dth: 'จัดการร้าน สินค้า และผู้เยี่ยมชมบูธ', den: 'Manage your shop, products and leads' },
      { to: '/register/exhibitor', icon: Briefcase, th: 'สมัครออกบูธ', en: 'Apply as exhibitor', dth: 'ลงทะเบียนผู้ประกอบการ', den: 'Exhibitor registration' },
      { to: '/portal/matching', icon: Handshake, th: 'Business Matching', en: 'Business Matching', dth: 'นัดเจรจากับ Buyer', den: 'Book meetings with buyers' },
      { to: '/ai', icon: Bot, th: 'Ask MOC AI', en: 'Ask MOC AI', dth: 'ผู้ช่วยแนะนำร้านและกิจกรรม', den: 'Assistant for shops and activities' },
    ],
  },
]

/** ทางลัดบนหน้าแรก V2 (สิ่งที่คนมาครั้งแรกต้องการที่สุด) */
export const QUICK_V2: NavItemV2[] = [
  { to: '/register', icon: Ticket, th: 'ลงทะเบียนรับ QR', en: 'Get your QR ticket', dth: 'ฟรี ใช้เวลา 1 นาที', den: 'Free, takes a minute' },
  { to: '/exhibitors', icon: Store, th: 'ค้นหาร้านและสินค้า', en: 'Find shops & products', dth: 'กว่า 300 บูธ', den: '300+ booths' },
  { to: '/schedule', icon: CalendarDays, th: 'กำหนดการ', en: 'Schedule', dth: 'Talk และกิจกรรม 3 วัน', den: 'Talks & activities, 3 days' },
  { to: '/guide/travel', icon: MapIcon, th: 'เดินทางมางาน', en: 'Getting there', dth: 'MRT ศูนย์ฯ สิริกิติ์', den: 'MRT Queen Sirikit' },
]
