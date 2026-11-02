import type { LText } from '../i18n/I18nProvider'

/**
 * เนื้อหาส่วนต่อขยายของหน้าแรก (กิจกรรม โปรโมชั่น การเดินทาง FAQ ข่าว คลิป)
 * ทั้งหมดเป็นข้อมูลสมมติสำหรับการสาธิต
 */

type Day = 1 | 2 | 3

/* ---------- Workshop & Live Commerce ---------- */
export type Workshop = { day: Day; start: string; end: string; title: LText; desc: LText; seats: number; takeHome: LText }

export const WORKSHOPS: Workshop[] = [
  { day: 1, start: '13:00', end: '14:30', title: { th: 'ทำผลิตภัณฑ์สมุนไพรไทย', en: 'Thai Herbal Products' }, desc: { th: 'ทำยาดมและบาล์มสมุนไพรสูตรโบราณ กับผู้ประกอบการ OTOP', en: 'Make a traditional herbal inhaler and balm with OTOP makers' }, seats: 30, takeHome: { th: 'ยาดม + บาล์ม 1 ชุด', en: 'Inhaler + balm set' } },
  { day: 2, start: '11:00', end: '12:30', title: { th: 'เพ้นท์หรือพับดอกไม้', en: 'Flower Painting & Folding' }, desc: { th: 'พับดอกไม้จากผ้าและใบเตย พร้อมเพ้นท์ลายบนกระถางดินเผา', en: 'Fold flowers from fabric and pandan leaves, then paint a clay pot' }, seats: 25, takeHome: { th: 'ดอกไม้ประดิษฐ์ในกระถาง', en: 'Potted handmade flower' } },
  { day: 2, start: '15:30', end: '16:30', title: { th: 'ทำเครื่องดื่มสมุนไพร', en: 'Herbal Drinks' }, desc: { th: 'ชงเครื่องดื่มอัญชัน ตะไคร้ และกระเจี๊ยบ ขายได้จริงในร้านคาเฟ่', en: 'Brew butterfly-pea, lemongrass and roselle drinks you can sell' }, seats: 30, takeHome: { th: 'สูตร + ชุดวัตถุดิบ', en: 'Recipe + ingredient kit' } },
  { day: 3, start: '11:00', end: '12:30', title: { th: 'ทำผลิตภัณฑ์สมุนไพรไทย (รอบ 2)', en: 'Thai Herbal Products (round 2)' }, desc: { th: 'รอบเพิ่มสำหรับผู้ที่พลาดวันแรก เนื้อหาเดียวกัน', en: 'Extra round for those who missed Day 1' }, seats: 30, takeHome: { th: 'ยาดม + บาล์ม 1 ชุด', en: 'Inhaler + balm set' } },
]

export type LiveSession = { when: LText; title: LText; host: LText; highlight?: boolean }

export const LIVE_COMMERCE: LiveSession[] = [
  { when: { th: 'ทุกวัน 12:00 – 13:00', en: 'Daily 12:00 – 13:00' }, title: { th: 'ไลฟ์ช้อปมื้อเที่ยง: ของกินของฝากจาก MOC TASTE', en: 'Lunch Live: food & gifts from MOC TASTE' }, host: { th: 'อินฟลูเอนเซอร์สายอาหาร', en: 'Food influencers' } },
  { when: { th: 'ทุกวัน 19:00 – 20:00', en: 'Daily 19:00 – 20:00' }, title: { th: 'ไลฟ์ขายตรงจากบูธ MOC HUB', en: 'Live from MOC HUB booths' }, host: { th: 'ผู้ประกอบการ + พิธีกร', en: 'SME owners + hosts' } },
  { when: { th: '5 ธ.ค. 17:00 – 18:00', en: '5 Dec 17:00 – 18:00' }, title: { th: 'Live Commerce Challenge: แข่งไลฟ์ปิดยอดขาย', en: 'Live Commerce Challenge: live-selling contest' }, host: { th: 'เวที MOC UP SKILL', en: 'MOC UP SKILL Stage' }, highlight: true },
]

export const LIVE_PLATFORMS = ['TikTok Shop', 'Shopee Live', 'LINE SHOPPING', 'Facebook Live']

/* ---------- เวทีกลาง: บันเทิง / ฮีลใจ / มอบความสุข ---------- */
export type StageKind = 'entertain' | 'heal' | 'joy'
export type StageAct = { day: Day | 0; time: string; kind: StageKind; title: LText; desc: LText }

export const STAGE_KINDS: Record<StageKind, LText> = {
  entertain: { th: 'บันเทิง', en: 'Entertainment' },
  heal: { th: 'ฮีลใจ', en: 'Healing' },
  joy: { th: 'มอบความสุข', en: 'Happiness' },
}

/** day = 0 คือมีทุกวัน */
export const CENTER_STAGE: StageAct[] = [
  { day: 1, time: '18:00', kind: 'entertain', title: { th: 'มินิคอนเสิร์ตเปิดงาน', en: 'Opening mini concert' }, desc: { th: 'วงอะคูสติกเพลงลูกทุ่งร่วมสมัย', en: 'Contemporary Thai acoustic band' } },
  { day: 0, time: '12:30', kind: 'heal', title: { th: 'Sound Healing ขันทิเบต', en: 'Singing-bowl sound healing' }, desc: { th: 'พัก 20 นาที ผ่อนคลายด้วยเสียงขันทิเบต', en: '20-minute singing-bowl relaxation break' } },
  { day: 2, time: '10:30', kind: 'heal', title: { th: 'ยืดเหยียดแก้ออฟฟิศซินโดรม', en: 'Stretching for office syndrome' }, desc: { th: 'ท่าง่าย ๆ ทำตามได้ทันที โดยนักกายภาพบำบัด', en: 'Easy stretches led by a physiotherapist' } },
  { day: 0, time: '15:00', kind: 'joy', title: { th: 'ลุ้นรางวัลมอบความสุข', en: 'Lucky draw' }, desc: { th: 'จับรางวัลจาก QR Ticket ของผู้เข้างาน ทุกวัน', en: 'Daily prize draw from visitors’ QR tickets' } },
  { day: 2, time: '18:30', kind: 'entertain', title: { th: 'ทอล์กโชว์ขำ ๆ เรื่องค้าขาย', en: 'Comedy talk show on doing business' }, desc: { th: 'เรื่องฮาจากชีวิตพ่อค้าแม่ค้าออนไลน์', en: 'Funny stories from online sellers' } },
  { day: 3, time: '13:30', kind: 'joy', title: { th: 'มุมเขียนการ์ดส่งกำลังใจ', en: 'Encouragement card corner' }, desc: { th: 'เขียนการ์ดให้ผู้ประกอบการ รับของที่ระลึกทันที', en: 'Write a card for SMEs and get a souvenir' } },
  { day: 3, time: '17:30', kind: 'entertain', title: { th: 'คอนเสิร์ตปิดงาน', en: 'Closing concert' }, desc: { th: 'ศิลปินรับเชิญ พร้อมประกาศผลรางวัลใหญ่', en: 'Guest artist and grand prize announcement' } },
]

/* ---------- โปรโมชั่น / คูปอง ---------- */
export type Coupon = { id: string; value: string; title: LText; where: LText; minSpend?: LText; quota: LText; code: string }

export const COUPONS: Coupon[] = [
  { id: 'hub100', value: '฿100', title: { th: 'ส่วนลดช้อปสินค้า SME', en: 'SME shopping discount' }, where: { th: 'ทุกบูธใน MOC HUB', en: 'All MOC HUB booths' }, minSpend: { th: 'เมื่อซื้อครบ ฿500', en: 'Min. spend ฿500' }, quota: { th: '2,000 สิทธิ์/วัน', en: '2,000 per day' }, code: 'MOCHUB100' },
  { id: 'taste15', value: '15%', title: { th: 'ส่วนลดร้านอาหาร', en: 'Food discount' }, where: { th: 'MOC TASTE ทุกร้าน', en: 'All MOC TASTE shops' }, minSpend: { th: 'ลดสูงสุด ฿80', en: 'Up to ฿80 off' }, quota: { th: '3,000 สิทธิ์/วัน', en: '3,000 per day' }, code: 'MOCTASTE15' },
  { id: 'live50', value: '฿50', title: { th: 'ส่วนลดสั่งผ่าน Live', en: 'Live-order discount' }, where: { th: 'Live Commerce ของงาน', en: 'Event live commerce' }, minSpend: { th: 'เมื่อซื้อครบ ฿300', en: 'Min. spend ฿300' }, quota: { th: '1,000 สิทธิ์/รอบไลฟ์', en: '1,000 per live' }, code: 'MOCLIVE50' },
  { id: 'gift', value: 'GIFT', title: { th: 'ของที่ระลึกผู้ลงทะเบียน', en: 'Registration gift' }, where: { th: 'จุดลงทะเบียน ประตู A', en: 'Registration desk, Gate A' }, quota: { th: '1,000 คนแรก/วัน', en: 'First 1,000 per day' }, code: 'MOCGIFT' },
]

export const COUPON_TERMS: LText[] = [
  { th: 'ต้องลงทะเบียนเข้างานและแสดง QR Ticket ก่อนใช้สิทธิ์', en: 'Register and show your QR ticket before redeeming' },
  { th: 'ใช้ได้ 4 – 6 ธ.ค. 2569 ภายในงานเท่านั้น', en: 'Valid 4 – 6 Dec 2026 at the event only' },
  { th: '1 คน ใช้ได้ 1 สิทธิ์ต่อคูปองต่อวัน', en: 'One redemption per coupon per person per day' },
  { th: 'ไม่สามารถแลกเปลี่ยนเป็นเงินสดหรือใช้ร่วมกับโปรโมชั่นอื่นของร้าน', en: 'No cash value; cannot be combined with other shop promotions' },
  { th: 'สิทธิ์มีจำนวนจำกัด หมดแล้วหมดเลย ผู้จัดขอสงวนสิทธิ์เปลี่ยนแปลงเงื่อนไข', en: 'While quotas last; the organiser may change these terms' },
]

/* ---------- การเดินทาง ---------- */
export type TravelMode = 'mrt' | 'bus' | 'car' | 'taxi'
export const TRAVEL: { mode: TravelMode; title: LText; detail: LText }[] = [
  { mode: 'mrt', title: { th: 'MRT สายสีน้ำเงิน (แนะนำ)', en: 'MRT Blue Line (recommended)' }, detail: { th: 'ลงสถานีศูนย์การประชุมแห่งชาติสิริกิติ์ เดินเชื่อมเข้าศูนย์ฯ ได้ทันที', en: 'Get off at Queen Sirikit National Convention Centre station and walk straight in' } },
  { mode: 'bus', title: { th: 'รถโดยสารประจำทาง', en: 'Public bus' }, detail: { th: 'ป้ายหน้าศูนย์ฯ ถนนรัชดาภิเษก และถนนพระราม 4', en: 'Stops on Ratchadaphisek Rd and Rama IV Rd' } },
  { mode: 'car', title: { th: 'รถยนต์ส่วนตัว', en: 'Car' }, detail: { th: 'ที่จอดรถใต้อาคาร ช่วงเย็นที่จอดเต็มเร็ว แนะนำขนส่งสาธารณะ', en: 'Underground parking; fills up in the evening, so public transport is advised' } },
  { mode: 'taxi', title: { th: 'แท็กซี่ / แอปเรียกรถ', en: 'Taxi / ride-hailing' }, detail: { th: 'จุดรับ-ส่งผู้โดยสารหน้าอาคารฝั่ง Hall 7–8', en: 'Drop-off point in front of Hall 7–8' } },
]
export const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Queen+Sirikit+National+Convention+Center'

export type Facility = 'wifi' | 'wheelchair' | 'nursing' | 'firstaid' | 'locker' | 'charging' | 'atm' | 'prayer'
export const FACILITIES: { id: Facility; label: LText }[] = [
  { id: 'wifi', label: { th: 'Wi-Fi ฟรีทั่วงาน', en: 'Free Wi-Fi' } },
  { id: 'wheelchair', label: { th: 'บริการรถเข็นวีลแชร์', en: 'Wheelchair service' } },
  { id: 'nursing', label: { th: 'ห้องให้นมบุตร', en: 'Nursing room' } },
  { id: 'firstaid', label: { th: 'จุดปฐมพยาบาล', en: 'First aid' } },
  { id: 'locker', label: { th: 'จุดฝากของ', en: 'Cloakroom' } },
  { id: 'charging', label: { th: 'จุดชาร์จแบตเตอรี่', en: 'Charging station' } },
  { id: 'atm', label: { th: 'ATM / จุดชำระ QR', en: 'ATM / QR payment' } },
  { id: 'prayer', label: { th: 'ห้องละหมาด', en: 'Prayer room' } },
]

/* ---------- FAQ ---------- */
export const FAQS: { q: LText; a: LText }[] = [
  { q: { th: 'เข้างานต้องเสียค่าใช้จ่ายไหม', en: 'Is there an entry fee?' }, a: { th: 'เข้าชมฟรีตลอด 3 วัน แนะนำให้ลงทะเบียนล่วงหน้าเพื่อรับ QR Ticket เข้างานได้เร็วขึ้นและรับสิทธิ์คูปอง', en: 'Entry is free on all 3 days. Register in advance for a QR ticket, faster entry and coupons.' } },
  { q: { th: 'ลงทะเบียนแล้ว ต้องพิมพ์บัตรมาไหม', en: 'Do I need to print my ticket?' }, a: { th: 'ไม่ต้อง แสดง QR Ticket บนมือถือที่จุดเช็คอินได้เลย', en: 'No. Show the QR ticket on your phone at check-in.' } },
  { q: { th: 'Workshop ต้องจองล่วงหน้าไหม', en: 'Do workshops need booking?' }, a: { th: 'แต่ละรอบรับจำนวนจำกัด จองล่วงหน้าได้ผ่านหน้าลงทะเบียน (เลือกความสนใจ Workshop) ที่เหลือรับ walk-in หน้าลาน Workshop ก่อนเริ่ม 15 นาที', en: 'Seats are limited. Pre-book via registration (choose Workshop as an interest); remaining seats open for walk-ins 15 minutes before start.' } },
  { q: { th: 'ผู้ประกอบการอยากออกบูธต้องทำอย่างไร', en: 'How can my business exhibit?' }, a: { th: 'สมัครที่ “ลงทะเบียนผู้ประกอบการ” แล้วติดตามผลการพิจารณาใน SME Portal (ร้านค้าของฉัน)', en: 'Apply via Exhibitor Registration and track the result in the SME Portal (My Shop).' } },
  { q: { th: 'นำสัตว์เลี้ยงเข้างานได้ไหม', en: 'Can I bring pets?' }, a: { th: 'อนุญาตเฉพาะสุนัขช่วยเหลือคนพิการ', en: 'Only assistance dogs are allowed.' } },
  { q: { th: 'ชำระเงินในงานได้ช่องทางไหนบ้าง', en: 'How can I pay at the event?' }, a: { th: 'ร้านส่วนใหญ่รับเงินสดและ QR พร้อมเพย์ บางร้านรับบัตรเครดิต', en: 'Most shops take cash and PromptPay QR; some accept cards.' } },
  { q: { th: 'ดูไลฟ์หรือคลิปย้อนหลังได้ที่ไหน', en: 'Where can I watch lives and replays?' }, a: { th: 'ดูได้ในส่วน “ข่าวและ Live Streaming” และ “คลิปย้อนหลัง” บนหน้านี้ รวมถึงเพจทางการของกระทรวงพาณิชย์', en: 'See “News & Live Streaming” and “Replays” on this page, and the Ministry of Commerce’s official pages.' } },
]

/* ---------- ข่าว / Live Streaming ---------- */
export const NEWS: { date: string; tag: LText; title: LText; excerpt: LText }[] = [
  { date: '2026-11-01', tag: { th: 'ประกาศ', en: 'Announcement' }, title: { th: 'เปิดลงทะเบียนเข้างาน รับ QR Ticket และคูปองส่วนลด', en: 'Registration opens with QR tickets and coupons' }, excerpt: { th: 'ลงทะเบียนวันนี้ รับสิทธิ์คูปอง MOC HUB และ MOC TASTE ใช้ได้ทั้ง 3 วัน', en: 'Register now for MOC HUB and MOC TASTE coupons valid all 3 days.' } },
  { date: '2026-10-28', tag: { th: 'ผู้ประกอบการ', en: 'Exhibitors' }, title: { th: 'ประกาศรายชื่อผู้ประกอบการ 200 ราย ใน MOC HUB', en: '200 SMEs confirmed for MOC HUB' }, excerpt: { th: 'คัดเลือกจาก 9 หน่วยงานกระทรวงพาณิชย์ ครอบคลุม 8 หมวดสินค้า', en: 'Selected by 9 MOC agencies across 8 product categories.' } },
  { date: '2026-10-20', tag: { th: 'Business Matching', en: 'Business Matching' }, title: { th: 'Buyer จาก 8 ประเทศยืนยันร่วมเจรจาธุรกิจ', en: 'Buyers from 8 countries confirm matching' }, excerpt: { th: 'เปิดให้ผู้ประกอบการขอนัดหมายล่วงหน้าผ่าน SME Portal', en: 'SMEs can book meetings in advance via the SME Portal.' } },
  { date: '2026-10-12', tag: { th: 'แถลงข่าว', en: 'Press' }, title: { th: 'แถลงข่าวเปิดตัว “พาณิชย์เอ็กซ์โป 2026”', en: '“Commerce Expo 2026” press launch' }, excerpt: { th: 'ตั้งเป้าผู้เข้าร่วม 8,000 ราย มูลค่าทางเศรษฐกิจ 100 ล้านบาท', en: 'Targeting 8,000 participants and THB 100M in economic value.' } },
]

export const STREAMS: { when: LText; title: LText }[] = [
  { when: { th: '4 ธ.ค. 10:00', en: '4 Dec 10:00' }, title: { th: 'ถ่ายทอดสดพิธีเปิดงาน', en: 'Opening ceremony' } },
  { when: { th: '5 ธ.ค. 17:00', en: '5 Dec 17:00' }, title: { th: 'Live Commerce Challenge', en: 'Live Commerce Challenge' } },
  { when: { th: '6 ธ.ค. 16:00', en: '6 Dec 16:00' }, title: { th: 'สรุปผลเจรจาธุรกิจ & พิธีปิด', en: 'Matching results & closing' } },
]
export const STREAM_CHANNELS = ['Facebook Live', 'YouTube', 'TikTok']

/* ---------- คลิปย้อนหลัง ---------- */
export const CLIPS: { thumb: string; duration: string; date: string; title: LText }[] = [
  { thumb: 'khao-soi-chef', duration: '12:40', date: '2026-10-30', title: { th: 'เบื้องหลังข้าวซอยเชฟเหนือ ก่อนเปิดบูธ MOC TASTE', en: 'Behind the scenes: Northern chef’s khao soi' } },
  { thumb: 'indigo-weave', duration: '08:15', date: '2026-10-24', title: { th: 'ผ้าครามสกลนคร จากกี่ทอมือสู่ตลาดโลก', en: 'Sakon Nakhon indigo: from loom to global market' } },
  { thumb: 'durian-king', duration: '05:52', date: '2026-10-18', title: { th: 'ทุเรียนฟรีซดราย สินค้าส่งออกดาวรุ่ง', en: 'Freeze-dried durian: a rising export' } },
  { thumb: 'lanna-coffee', duration: '15:03', date: '2026-10-12', title: { th: 'ไฮไลต์งานแถลงข่าวเปิดตัว พาณิชย์เอ็กซ์โป 2026', en: 'Highlights: Commerce Expo 2026 press launch' } },
  { thumb: 'andaman-spa', duration: '09:27', date: '2026-10-05', title: { th: 'เคล็ดลับไลฟ์ขายของให้ปัง จากอินฟลูเอนเซอร์', en: 'Live-selling tips from influencers' } },
  { thumb: 'agri-drone', duration: '06:48', date: '2026-09-28', title: { th: 'โดรนเกษตร นวัตกรรมไทยที่ Buyer จับตา', en: 'Agri drones: Thai innovation buyers watch' } },
]
