import type { LText } from '../i18n/I18nProvider'
import type { PavilionId } from './types'
import { PAVILIONS, zoneLabel } from './event'

export type Zone = {
  id: string
  kind: 'pavilion' | 'stage' | 'food' | 'matching' | 'workshop' | 'registration' | 'rest'
  label: LText
  desc: LText
  x: number
  y: number
  w: number
  h: number
  color: string
  pavilion?: PavilionId
}

const pav = (id: PavilionId, x: number, y: number, w: number, h: number): Zone => ({
  id,
  kind: 'pavilion',
  label: { th: zoneLabel(id), en: zoneLabel(id) },
  desc: PAVILIONS[id].desc,
  x, y, w, h,
  color: PAVILIONS[id].color,
  pavilion: id,
})

// พิกัดเชิงแนวคิดสำหรับผังเดโม Hall 7–8 บนระนาบ 1000 x 600
// FloorPlanMap ฉายพิกัดนี้เป็นมุมมอง 2.5D — ไม่ใช่ผังทางการของ QSNCC
export const ZONES: Zone[] = [
  pav('hub', 20, 20, 470, 250),
  { id: 'upskill', kind: 'stage', label: { th: 'Zone 2 · MOC UP SKILL', en: 'Zone 2 · MOC UP SKILL' }, desc: { th: 'เวทีเสริมทักษะ องค์ความรู้ และสาระบันเทิง', en: 'Stage for skills, knowledge & edutainment' }, x: 505, y: 20, w: 235, h: 250, color: '#1d4ed8' },
  pav('taste', 755, 20, 225, 250),
  { id: 'consult', kind: 'pavilion', label: { th: 'Pavilion ให้คำปรึกษา', en: 'Advisory Pavilion' }, desc: { th: '14 หน่วยงาน: กระทรวงพาณิชย์ 9 + พันธมิตร 5', en: '14 agencies: 9 MOC + 5 partners' }, x: 20, y: 285, w: 230, h: 215, color: '#002a6e' },
  pav('private', 265, 285, 225, 215),
  { id: 'matching', kind: 'matching', label: { th: 'Business Matching Lounge', en: 'Business Matching Lounge' }, desc: { th: 'โต๊ะเจรจาธุรกิจกับหน่วยงานพันธมิตร', en: 'Negotiation tables with partners' }, x: 505, y: 285, w: 235, h: 215, color: '#5b21b6' },
  { id: 'workshop', kind: 'workshop', label: { th: 'Workshop', en: 'Workshop' }, desc: { th: 'สมุนไพรไทย พับดอกไม้ เครื่องดื่มสมุนไพร', en: 'Herbal products, flowers, herbal drinks' }, x: 755, y: 285, w: 225, h: 215, color: '#15803d' },
  { id: 'registration', kind: 'registration', label: { th: 'Registration / ทางเข้า', en: 'Registration / Entrance' }, desc: { th: 'จุดลงทะเบียนและสแกน QR เข้างาน', en: 'Registration & QR check-in gates' }, x: 20, y: 515, w: 700, h: 65, color: '#8a6a1f' },
  { id: 'rest', kind: 'rest', label: { th: 'Rest Area', en: 'Rest Area' }, desc: { th: 'จุดพักผ่อน ชาร์จแบต และห้องให้นมบุตร', en: 'Seating, charging & nursing room' }, x: 735, y: 515, w: 245, h: 65, color: '#64748b' },
]
