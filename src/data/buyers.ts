import type { Buyer } from './types'

// รายชื่อ Buyer และโลโก้ที่ออกแบบเป็นแบรนด์สมมติสำหรับ Demo
const logo = (id: string) => `${import.meta.env.BASE_URL}images/buyers/${id}.webp`
export const BUYERS: Buyer[] = [
  {
    id: 'siam-retail', name: 'Siam Retail Group', color: '#b91c1c',
    logo: logo('siam-retail'),
    type: { th: 'ค้าปลีก / Modern Trade', en: 'Retail / Modern Trade' },
    country: { th: 'ไทย', en: 'Thailand' },
    description: { th: 'กลุ่มห้างสรรพสินค้าและซูเปอร์มาร์เก็ต 180 สาขาทั่วประเทศ กำลังขยายเชลฟ์สินค้า SME และสินค้าสุขภาพ', en: 'Department store and supermarket group with 180 branches, expanding SME and healthy-product shelves.' },
    interests: ['food', 'health', 'home'],
    lookingFor: { th: 'สินค้าอาหารสุขภาพ ขนมพรีเมียม ของใช้ในบ้านดีไซน์ไทย', en: 'Healthy food, premium snacks, Thai-designed homeware' },
    budget: '฿5–20M / yr', slotsTaken: ['1-10:30', '1-13:00', '2-11:00'],
  },
  {
    id: 'tokyo-foods', name: 'Tokyo Fine Foods Import', color: '#7c3aed',
    logo: logo('tokyo-foods'),
    type: { th: 'ผู้นำเข้า / Distributor', en: 'Importer / Distributor' },
    country: { th: 'ญี่ปุ่น', en: 'Japan' },
    description: { th: 'ผู้นำเข้าอาหารเอเชียระดับพรีเมียมสู่ซูเปอร์มาร์เก็ตในญี่ปุ่น', en: 'Importer of premium Asian food into Japanese supermarkets.' },
    interests: ['food', 'agri'],
    lookingFor: { th: 'ผลไม้อบแห้ง กาแฟ ข้าวอินทรีย์ ที่มีใบรับรองส่งออก', en: 'Dried fruit, coffee and organic rice with export certification' },
    budget: '฿10–30M / yr', slotsTaken: ['1-10:00', '2-14:00'],
  },
  {
    id: 'lanna-hotels', name: 'Lanna Hospitality Group', color: '#0e7490',
    logo: logo('lanna-hotels'),
    type: { th: 'โรงแรม / HoReCa', en: 'Hotel / HoReCa' },
    country: { th: 'ไทย', en: 'Thailand' },
    description: { th: 'เครือโรงแรมและรีสอร์ท 24 แห่ง จัดซื้อของใช้สปาและของตกแต่งจากชุมชน', en: '24 hotels and resorts sourcing spa amenities and decor from communities.' },
    interests: ['health', 'home', 'craft'],
    lookingFor: { th: 'ผลิตภัณฑ์สปา ของตกแต่งงานฝีมือ ผ้าทอ', en: 'Spa amenities, handicraft decor, woven textiles' },
    budget: '฿2–8M / yr', slotsTaken: ['1-11:30', '3-10:00'],
  },
  {
    id: 'shopnow', name: 'ShopNow Marketplace', color: '#c2410c',
    logo: logo('shopnow'),
    type: { th: 'อีคอมเมิร์ซ', en: 'E-commerce' },
    country: { th: 'ไทย', en: 'Thailand' },
    description: { th: 'แพลตฟอร์มมาร์เก็ตเพลส กำลังเปิดโครงการ “SME Thai Mall” พร้อมส่วนลดค่าธรรมเนียม', en: 'Marketplace platform launching an “SME Thai Mall” program with reduced fees.' },
    interests: ['food', 'fashion', 'health', 'home', 'craft'],
    lookingFor: { th: 'แบรนด์ SME ที่พร้อมขายออนไลน์', en: 'SME brands ready to sell online' },
    budget: 'Revenue share', slotsTaken: ['2-10:00'],
  },
  {
    id: 'eu-green', name: 'EU Green Sourcing BV', color: '#15803d',
    logo: logo('eu-green'),
    type: { th: 'ผู้นำเข้า (ยุโรป)', en: 'Importer (Europe)' },
    country: { th: 'เนเธอร์แลนด์', en: 'Netherlands' },
    description: { th: 'จัดหาสินค้ารักษ์โลกและสินค้า BCG สำหรับร้านค้าในยุโรป', en: 'Sources sustainable and BCG products for European retailers.' },
    interests: ['home', 'fashion', 'craft', 'service'],
    lookingFor: { th: 'สินค้ารีไซเคิล บรรจุภัณฑ์ย่อยสลายได้ ของใช้ไม้ไผ่', en: 'Recycled goods, compostable packaging, bamboo homeware' },
    budget: '€300K–1M / yr', slotsTaken: ['1-14:00', '2-10:30'],
  },
  {
    id: 'asean-trade', name: 'ASEAN Cross-Border Trading', color: '#a16207',
    logo: logo('asean-trade'),
    type: { th: 'ค้าชายแดน / Trader', en: 'Cross-border Trader' },
    country: { th: 'สปป.ลาว / เวียดนาม', en: 'Lao PDR / Vietnam' },
    description: { th: 'ผู้กระจายสินค้าไทยสู่ตลาด CLMV ผ่านด่านชายแดน', en: 'Distributes Thai goods into CLMV markets through border trade.' },
    interests: ['food', 'health', 'agri'],
    lookingFor: { th: 'อาหารแปรรูป เครื่องดื่ม สมุนไพร', en: 'Processed food, beverages, herbal products' },
    budget: '฿3–10M / yr', slotsTaken: [],
  },
  {
    id: 'franchise-hub', name: 'Franchise Investor Hub', color: '#be123c',
    logo: logo('franchise-hub'),
    type: { th: 'นักลงทุนแฟรนไชส์', en: 'Franchise Investor' },
    country: { th: 'ไทย / มาเลเซีย', en: 'Thailand / Malaysia' },
    description: { th: 'กลุ่มนักลงทุนที่มองหาแฟรนไชส์ไทยเพื่อขยายสาขาในมาเลเซีย', en: 'Investor group seeking Thai franchises to expand into Malaysia.' },
    interests: ['service', 'food'],
    lookingFor: { th: 'แฟรนไชส์อาหารและเครื่องดื่มที่มีระบบมาตรฐาน', en: 'F&B franchises with standardised systems' },
    budget: 'Master franchise', slotsTaken: ['3-13:00'],
  },
  {
    id: 'gov-procure', name: 'Public Sector Procurement Network', color: '#1d4ed8',
    logo: logo('gov-procure'),
    type: { th: 'จัดซื้อภาครัฐ', en: 'Public Procurement' },
    country: { th: 'ไทย', en: 'Thailand' },
    description: { th: 'เครือข่ายหน่วยงานจัดซื้อที่สนับสนุนสินค้า SME ไทย (Thai SME-GP)', en: 'Procurement network supporting Thai SME goods (Thai SME-GP).' },
    interests: ['tech', 'service', 'home', 'agri'],
    lookingFor: { th: 'บริการดิจิทัล อุปกรณ์สำนักงาน สินค้าเกษตร', en: 'Digital services, office goods, agricultural products' },
    budget: '฿10M+ / yr', slotsTaken: ['1-10:00', '1-10:30'],
  },
]

export const BUYER_BY_ID: Record<string, Buyer> = Object.fromEntries(BUYERS.map((b) => [b.id, b]))

export const TIME_SLOTS = ['10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30']

export const OBJECTIVES = {
  distribution: { th: 'หาช่องทางจัดจำหน่าย', en: 'Distribution' },
  partnership: { th: 'ร่วมเป็นพันธมิตร', en: 'Partnership' },
  export: { th: 'ส่งออก', en: 'Export' },
  procurement: { th: 'จัดซื้อจัดจ้าง', en: 'Procurement' },
} as const
