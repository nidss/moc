import type { LText } from '../i18n/I18nProvider'
import type { PavilionId } from './types'
import { PAVILIONS } from './event'

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

const pav = (id: PavilionId, code: string, x: number, y: number, w: number, h: number): Zone => ({
  id,
  kind: 'pavilion',
  label: { th: `${code} · ${PAVILIONS[id].name}`, en: `${code} · ${PAVILIONS[id].name}` },
  desc: PAVILIONS[id].desc,
  x, y, w, h,
  color: PAVILIONS[id].color,
  pavilion: id,
})

// ผังฮอลล์ (หน่วยเป็นพิกัด SVG viewBox 1000 x 600)
export const ZONES: Zone[] = [
  pav('local', 'A', 20, 20, 290, 230),
  pav('smart', 'B', 325, 20, 240, 230),
  pav('global', 'C', 580, 20, 240, 230),
  pav('franchise', 'D', 20, 265, 290, 235),
  pav('green', 'E', 325, 265, 240, 130),
  { id: 'main-stage', kind: 'stage', label: { th: 'Main Stage', en: 'Main Stage' }, desc: { th: 'เวทีหลัก พิธีเปิด และ Talk', en: 'Opening ceremony & talks' }, x: 835, y: 20, w: 145, h: 230, color: '#be123c' },
  { id: 'food', kind: 'food', label: { th: 'Food Zone', en: 'Food Zone' }, desc: { th: 'ศูนย์อาหารและสินค้าทดลองชิม', en: 'Food court & tasting' }, x: 580, y: 265, w: 240, h: 130, color: '#ea580c' },
  { id: 'matching', kind: 'matching', label: { th: 'Business Matching Lounge', en: 'Business Matching Lounge' }, desc: { th: 'โต๊ะเจรจาธุรกิจ 40 โต๊ะ', en: '40 negotiation tables' }, x: 835, y: 265, w: 145, h: 235, color: '#0b3a82' },
  { id: 'workshop', kind: 'workshop', label: { th: 'Workshop · MOC Up Skill', en: 'Workshop · MOC Up Skill' }, desc: { th: 'ห้องอบรมเชิงปฏิบัติการ', en: 'Hands-on workshop room' }, x: 325, y: 410, w: 240, h: 90, color: '#0e7490' },
  { id: 'rest', kind: 'rest', label: { th: 'Rest Area', en: 'Rest Area' }, desc: { th: 'จุดพักผ่อน ชาร์จแบต และห้องให้นมบุตร', en: 'Seating, charging & nursing room' }, x: 580, y: 410, w: 240, h: 90, color: '#64748b' },
  { id: 'registration', kind: 'registration', label: { th: 'Registration / ทางเข้า', en: 'Registration / Entrance' }, desc: { th: 'จุดลงทะเบียนและสแกน QR เข้างาน', en: 'Registration & QR check-in gates' }, x: 20, y: 515, w: 960, h: 65, color: '#a16207' },
]
