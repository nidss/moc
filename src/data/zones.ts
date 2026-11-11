import type { LText } from '../i18n/I18nProvider'
import type { PavilionId } from './types'
import { PAVILIONS } from './event'

/** สี่เหลี่ยมบนผัง (r = มุมโค้ง ถ้า r = w/2 = h/2 จะเป็นวงกลม) */
export type Rect = { x: number; y: number; w: number; h: number; r?: number }

export type Zone = {
  id: string
  /** เลขโซนตามผังจริง (Zone 1–8) แสดงบนป้ายในผัง */
  code: string
  kind: 'pavilion' | 'advisory' | 'partner' | 'stage' | 'food' | 'matching' | 'workshop' | 'live' | 'service' | 'rest'
  label: LText
  desc: LText
  /** ชื่อบนป้ายในผัง (ภาษาอังกฤษตามผังจริง) */
  mapLabel?: string
  color: string
  /** พื้นที่ที่คลิกได้ของโซน (บางโซนมีหลายส่วน เช่น MOC TASTE สองฝั่ง) */
  shapes: Rect[]
  /** ตำแหน่งกึ่งกลางป้ายชื่อโซนบนผัง */
  tags: [number, number][]
  pavilion?: PavilionId
}

/** Pavilion 1–9 ของ Zone 1 MOC HUB หนึ่งหน่วยงานต่อหนึ่ง Pavilion */
export type HubPavilion = {
  no: number
  /** รหัสใน AGENCIES */
  agency: string
  /** ชื่อย่อภาษาไทยตามผังจริง */
  abbr: string
  rect: Rect
  /** h = แถวบูธแนวนอน, v = แถวบูธแนวตั้ง, d = บูธแนวตั้งสองแถว */
  layout: 'h' | 'v' | 'd'
  /** ฝั่งที่มีเคาน์เตอร์ประชาสัมพันธ์ครึ่งวงกลม */
  counter: 'left' | 'right' | 'bottom'
}

// พิกัดทั้งหมดอิงพิกเซลของผังจริง Hall 7–8 (ภาพ 1688 x 2000) เพื่อให้วางทับได้ตรงกับผังต้นฉบับ
export const VIEW = { x: 150, y: 120, w: 1400, h: 1730 }
export const HALL: Rect = { x: 185, y: 195, w: 1330, h: 1377 }
export const WALKWAY: Rect = { x: 824, y: 625, w: 52, h: 947 }

export const HUB_PAVILIONS: HubPavilion[] = [
  { no: 1, agency: 'DITP', abbr: 'สค.', rect: { x: 313, y: 1392, w: 254, h: 140 }, layout: 'h', counter: 'right' },
  { no: 2, agency: 'DFT', abbr: 'คต.', rect: { x: 1132, y: 1392, w: 254, h: 140 }, layout: 'h', counter: 'left' },
  { no: 3, agency: 'DTN', abbr: 'จร.', rect: { x: 262, y: 1075, w: 153, h: 255 }, layout: 'v', counter: 'bottom' },
  { no: 4, agency: 'OPS', abbr: 'สป.', rect: { x: 454, y: 1075, w: 153, h: 255 }, layout: 'v', counter: 'bottom' },
  { no: 5, agency: 'DBD', abbr: 'พค.', rect: { x: 1081, y: 1075, w: 344, h: 255 }, layout: 'd', counter: 'bottom' },
  { no: 6, agency: 'SACIT', abbr: 'SA.', rect: { x: 516, y: 897, w: 255, h: 140 }, layout: 'h', counter: 'right' },
  { no: 7, agency: 'GIT', abbr: 'GIT.', rect: { x: 929, y: 897, w: 254, h: 140 }, layout: 'h', counter: 'left' },
  { no: 8, agency: 'DIP', abbr: 'ทป.', rect: { x: 516, y: 718, w: 255, h: 140 }, layout: 'h', counter: 'right' },
  { no: 9, agency: 'DIT', abbr: 'คน.', rect: { x: 929, y: 718, w: 254, h: 140 }, layout: 'h', counter: 'left' },
]

export const hubPavilionOf = (agency?: string) => HUB_PAVILIONS.find((p) => p.agency === agency)

/** พาวิลเลียนพันธมิตร (Partner Pavilion) แบ่งพื้นที่ตามผังจริง */
export const PARTNER_BLOCKS: { name: string; size: string; rect: Rect; fill: string }[] = [
  { name: 'ATTM', size: '110', rect: { x: 222, y: 897, w: 128, h: 140 }, fill: '#eef2ff' },
  { name: 'CU', size: '51', rect: { x: 350, y: 897, w: 128, h: 73 }, fill: '#e6f6fb' },
  { name: 'NEX GEN', size: '9', rect: { x: 438, y: 930, w: 40, h: 40 }, fill: '#f3ebff' },
  { name: 'ITD', size: '25', rect: { x: 350, y: 970, w: 64, h: 67 }, fill: '#fdf6e3' },
  { name: 'ไทยรุ่งเรือง', size: '25', rect: { x: 414, y: 970, w: 64, h: 67 }, fill: '#f8c3a2' },
]

const TASTE_LEFT: Rect = { x: 225, y: 237, w: 343, h: 431, r: 22 }
const TASTE_RIGHT: Rect = { x: 1133, y: 237, w: 344, h: 431, r: 22 }
export const TASTE_AREAS = [TASTE_LEFT, TASTE_RIGHT]

export const ZONES: Zone[] = [
  {
    id: 'hub', code: '1', kind: 'pavilion', pavilion: 'hub', mapLabel: 'MOC HUB', color: PAVILIONS.hub.color,
    label: { th: 'Zone 1 · MOC HUB', en: 'Zone 1 · MOC HUB' },
    desc: { th: 'Pavilion 1–9 สินค้าจาก 9 หน่วยงานกระทรวงพาณิชย์ (รวม 11 Pavilion ในโซน)', en: 'Pavilions 1–9 with products from 9 MOC agencies (11 pavilions in the zone)' },
    shapes: HUB_PAVILIONS.map((p) => p.rect), tags: [[850, 884]],
  },
  {
    id: 'consult', code: '1', kind: 'advisory', color: '#002a6e',
    label: { th: 'Zone 1 · Pavilion 10 ให้คำปรึกษา', en: 'Zone 1 · Pavilion 10 Advisory' },
    desc: { th: 'ศูนย์บริการให้คำปรึกษาธุรกิจ 14 หน่วยงาน: กระทรวงพาณิชย์ 9 + พันธมิตร 5', en: 'Business advisory hub, 14 agencies: 9 MOC + 5 partners' },
    shapes: [{ x: 748, y: 1248, w: 204, h: 204, r: 102 }], tags: [],
  },
  {
    id: 'private', code: '1', kind: 'partner', pavilion: 'private', mapLabel: 'PARTNER PAVILION', color: PAVILIONS.private.color,
    label: { th: 'Zone 1 · Partner Pavilion', en: 'Zone 1 · Partner Pavilion' },
    desc: { th: 'พื้นที่ภาคเอกชน (Private Pavilion): ATTM, CU, NEX GEN, ITD และไทยรุ่งเรือง', en: 'Private-sector partners (Private Pavilion): ATTM, CU, NEX GEN, ITD and Thai Rung Ruang' },
    shapes: [{ x: 222, y: 897, w: 256, h: 140 }], tags: [[350, 1057]],
  },
  {
    id: 'upskill', code: '2', kind: 'stage', mapLabel: 'MOC UP SKILL', color: '#1d4ed8',
    label: { th: 'Zone 2 · MOC UP SKILL', en: 'Zone 2 · MOC UP SKILL' },
    desc: { th: 'เวทีกลาง เสริมทักษะ องค์ความรู้ และสาระบันเทิง', en: 'Main stage for skills, knowledge & edutainment' },
    shapes: [{ x: 686, y: 205, w: 328, h: 385, r: 10 }], tags: [[850, 365]],
  },
  {
    id: 'taste', code: '3', kind: 'food', pavilion: 'taste', mapLabel: 'MOC TASTE', color: PAVILIONS.taste.color,
    label: { th: 'Zone 3 · MOC TASTE', en: 'Zone 3 · MOC TASTE' },
    desc: { th: 'ช้อปชิมอาหารเด็ด ร้านดัง ร้านรางวัล และร้านเชฟ สองฝั่งด้านในของ Hall พร้อมลานนั่งพัก', en: 'Award-winning, celebrity & chef food booths on both inner sides of the hall, with seating' },
    shapes: TASTE_AREAS, tags: [[300, 168], [1400, 168]],
  },
  {
    id: 'workshop', code: '4', kind: 'workshop', mapLabel: 'WORKSHOP', color: '#15803d',
    label: { th: 'Zone 4 · Workshop', en: 'Zone 4 · Workshop' },
    desc: { th: 'สมุนไพรไทย พับดอกไม้ เครื่องดื่มสมุนไพร', en: 'Herbal products, flowers, herbal drinks' },
    shapes: [{ x: 224, y: 718, w: 254, h: 140 }], tags: [[351, 788]],
  },
  {
    id: 'matching', code: '5', kind: 'matching', mapLabel: 'BUSINESS MATCHING', color: '#5b21b6',
    label: { th: 'Zone 5 · Business Matching', en: 'Zone 5 · Business Matching' },
    desc: { th: 'โต๊ะเจรจาธุรกิจกับผู้ซื้อและหน่วยงานพันธมิตร', en: 'Negotiation tables with buyers and partners' },
    shapes: [{ x: 1221, y: 718, w: 254, h: 140 }], tags: [[1348, 788]],
  },
  {
    id: 'ops', code: '6', kind: 'service', mapLabel: 'OPERATIONS CENTER', color: '#475569',
    label: { th: 'Zone 6 · Operations Center', en: 'Zone 6 · Operations Center' },
    desc: { th: 'ศูนย์ปฏิบัติการผู้จัดงาน ปฐมพยาบาล และรับแจ้งของหาย', en: 'Organiser HQ, first aid and lost & found' },
    shapes: [{ x: 730, y: 1574, w: 240, h: 66, r: 8 }], tags: [[850, 1607]],
  },
  {
    id: 'live', code: '7', kind: 'live', mapLabel: 'LIVE STREAM', color: '#be123c',
    label: { th: 'Zone 7 · Live Stream', en: 'Zone 7 · Live Stream' },
    desc: { th: 'สตูดิโอไลฟ์ขายสินค้าออนไลน์สำหรับผู้ประกอบการ', en: 'Live-commerce studio for exhibitors' },
    shapes: [{ x: 1221, y: 897, w: 254, h: 140 }], tags: [[1348, 967]],
  },
  {
    id: 'info', code: '8', kind: 'service', mapLabel: 'INFORMATION', color: '#8a6a1f',
    label: { th: 'Zone 8 · Information', en: 'Zone 8 · Information' },
    desc: { th: 'จุดประชาสัมพันธ์ ลงทะเบียน และสแกน QR เข้างานที่ทางเข้า Hall 7', en: 'Information, registration & QR check-in at the Hall 7 entrance' },
    shapes: [{ x: 192, y: 1405, w: 44, h: 132, r: 6 }, { x: 168, y: 1745, w: 150, h: 54, r: 27 }], tags: [[255, 1607]],
  },
  {
    id: 'rest', code: '·', kind: 'rest', color: '#3f7d55',
    label: { th: 'Rest Area', en: 'Rest Area' },
    desc: { th: 'จุดพักผ่อนและชาร์จแบต ข้างเวทีและใน MOC TASTE', en: 'Seating & charging beside the stage and in MOC TASTE' },
    shapes: [{ x: 587, y: 310, w: 58, h: 358, r: 29 }, { x: 1057, y: 310, w: 58, h: 358, r: 29 }], tags: [],
  },
]
