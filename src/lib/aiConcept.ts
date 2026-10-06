import { BUYERS } from '../data/buyers'
import { CATEGORIES } from '../data/event'
import { EXHIBITORS } from '../data/exhibitors'
import { SCHEDULE } from '../data/schedule'
import type { Buyer, Exhibitor, ScheduleItem } from '../data/types'
import type { Lang } from '../i18n/I18nProvider'

export type AiAnswer = {
  text: string
  exhibitors?: Exhibitor[]
  buyer?: Buyer
  sessions?: ScheduleItem[]
  link?: { to: string; label: string }
}

const has = (q: string, words: string[]) => words.some((w) => q.includes(w))

/**
 * ผู้ช่วย AI แบบ Concept: ตอบจากข้อมูลในระบบด้วยการจับคำสำคัญ (ไม่ได้เชื่อมต่อ LLM จริง)
 * ในระบบจริงจะใช้ LLM + RAG บนฐานข้อมูลผู้ออกบูธ Buyer และกำหนดการ
 */
export function answer(question: string, lang: Lang): AiAnswer {
  const q = question.toLowerCase()
  const t = (th: string, en: string) => (lang === 'th' ? th : en)

  const buyer = BUYERS.find((b) => b.name.toLowerCase().split(' ').some((w) => w.length > 3 && q.includes(w)))
  if (buyer) {
    const recs = EXHIBITORS.filter((e) => buyer.interests.includes(e.category) && e.status === 'approved').slice(0, 4)
    return {
      text: t(
        `${buyer.name} (${buyer.type.th}) กำลังมองหา: ${buyer.lookingFor.th}\nหมวดที่สนใจ: ${buyer.interests.map((c) => CATEGORIES[c].th).join(', ')} · งบประมาณ ${buyer.budget}\n\nผู้ประกอบการที่เหมาะสมสำหรับนัด Business Matching:`,
        `${buyer.name} (${buyer.type.en}) is looking for: ${buyer.lookingFor.en}\nCategories: ${buyer.interests.map((c) => CATEGORIES[c].en).join(', ')} · Budget ${buyer.budget}\n\nRecommended SMEs for Business Matching:`,
      ),
      buyer,
      exhibitors: recs,
      link: { to: `/matching/request/${buyer.id}`, label: t('ขอนัดประชุมกับ Buyer นี้', 'Request a meeting with this buyer') },
    }
  }

  if (has(q, ['สุขภาพ', 'healthy', 'health', 'ออร์แกนิค', 'organic'])) {
    const list = EXHIBITORS.filter((e) => e.tags.includes('healthy'))
    return {
      text: t(
        `มีผู้ประกอบการในกลุ่ม Healthy Food ทั้งหมด 32 ราย (ข้อมูลตัวอย่างในเดโม ${list.length} ราย) แนะนำร้านเด่น 4 ร้าน:`,
        `There are 32 SMEs in the Healthy Food group (${list.length} in this demo). Here are 4 standouts:`,
      ),
      exhibitors: list.slice(0, 4),
      link: { to: '/exhibitors?q=healthy', label: t('ดูทั้งหมด', 'See all') },
    }
  }

  if (has(q, ['taste', 'ร้านอาหาร', 'ชิม', 'ของกิน', 'อาหารอร่อย', 'eat'])) {
    const list = EXHIBITORS.filter((e) => e.pavilion === 'taste')
    return {
      text: t(
        `โซน MOC TASTE มีร้านอาหารและเครื่องดื่มชื่อดัง 100 บูธ (ในเดโม ${list.length} ร้าน) ทั้งร้านรางวัล ร้านเชฟ และร้านอินฟลูเอนเซอร์ แนะนำ:`,
        `MOC TASTE has 100 famous food & drink booths (${list.length} in this demo) — award winners, chef and influencer shops. Try:`,
      ),
      exhibitors: list.slice(0, 4),
      link: { to: '/exhibitors?pavilion=taste', label: t('ดูร้านทั้งหมดใน MOC TASTE', 'See all MOC TASTE shops') },
    }
  }

  if (has(q, ['กิจกรรม', 'workshop', 'สัมมนา', 'schedule', 'activity', 'วันนี้', 'today', 'เวที', 'stage'])) {
    return {
      text: t('กิจกรรมไฮไลต์วันแรก (4 ธ.ค.):', 'Day 1 highlights (4 Dec):'),
      sessions: SCHEDULE.filter((s) => s.day === 1).slice(0, 5),
      link: { to: '/schedule', label: t('ดูกำหนดการทั้งหมด', 'Full schedule') },
    }
  }

  if (has(q, ['matching', 'จับคู่', 'นัด', 'buyer', 'ผู้ซื้อ'])) {
    return {
      text: t(
        'Business Matching ทำได้ 3 ขั้นตอน:\n1) ค้นหา Buyer ที่สนใจหมวดสินค้าของคุณ\n2) เลือกวันและเวลา (ช่วงละ 30 นาที)\n3) พบกันที่ Matching Lounge แล้วบันทึกผลดีลในระบบ\n\nตอนนี้มี Buyer เปิดรับนัด 8 ราย จาก 6 ประเทศ',
        'Business Matching in 3 steps:\n1) Find buyers interested in your category\n2) Pick a date and 30-minute slot\n3) Meet at the Matching Lounge and log the deal outcome\n\n8 buyers from 6 countries are accepting meetings now.',
      ),
      link: { to: '/matching', label: t('ไปที่ Business Matching', 'Go to Business Matching') },
    }
  }

  if (has(q, ['ที่ไหน', 'where', 'เดินทาง', 'mrt', 'จอดรถ', 'parking', 'สถานที่', 'venue'])) {
    return {
      text: t(
        'งานจัดวันที่ 4–6 ธันวาคม 2569 ที่ศูนย์การประชุมแห่งชาติสิริกิติ์ (QSNCC) Hall 7–8 เดินทางสะดวกด้วย MRT สถานีศูนย์การประชุมฯ มีที่จอดรถในอาคาร',
        'The event runs 4–6 December 2026 at QSNCC Hall 7–8. Take the MRT to QSNCC station; indoor parking is available.',
      ),
      link: { to: '/floorplan', label: t('ดูผังงาน', 'View floor plan') },
    }
  }

  // ค้นหาทั่วไปจากชื่อร้านและสินค้า
  const words = q.split(/\s+/).filter((w) => w.length >= 2)
  const hits = EXHIBITORS.filter((e) =>
    words.some((w) => [e.name.th, e.name.en, ...e.products.flatMap((p) => [p.name.th, p.name.en]), CATEGORIES[e.category].th, CATEGORIES[e.category].en].some((s) => s.toLowerCase().includes(w))),
  )
  if (hits.length) {
    return { text: t(`พบ ${hits.length} ร้านที่เกี่ยวข้อง:`, `Found ${hits.length} related shops:`), exhibitors: hits.slice(0, 4) }
  }

  return {
    text: t(
      'ขออภัย ยังไม่พบข้อมูลที่ตรงกับคำถาม ลองถามเกี่ยวกับสินค้า ร้านค้า Buyer หรือกิจกรรมในงานดูนะครับ',
      "Sorry, I couldn't find a match. Try asking about products, shops, buyers or activities.",
    ),
  }
}
